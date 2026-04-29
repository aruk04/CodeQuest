from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User, UserProfile
from app.models.roadmap import RoadmapNode, NodeStatus
from app.models.lesson import Lesson, Exercise
from app.models.progress import UserProgress, XPTransaction, WeakArea
from app.schemas.lesson import (
    LessonResponse, ExerciseResponse, SubmitAnswerRequest,
    SubmitAnswerResponse, GenerateLessonRequest
)
from app.services.ai_service import AIService
from app.services.adaptive_service import AdaptiveService

router = APIRouter(prefix="/api/lessons", tags=["lessons"])
ai_service = AIService()
adaptive_service = AdaptiveService()

JUDGE0_LANGUAGE_IDS = {
    "python": 71,
    "javascript": 63,
    "cpp": 54,
    "java": 62,
}


@router.post("/generate", response_model=LessonResponse)
async def generate_lesson(
    data: GenerateLessonRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Check if lesson already exists for this node
    result = await db.execute(
        select(Lesson).where(Lesson.node_id == data.node_id).limit(1)
    )
    existing = result.scalar_one_or_none()
    if existing:
        return await _build_lesson_response(existing, db)

    # Get node
    result2 = await db.execute(select(RoadmapNode).where(RoadmapNode.id == data.node_id))
    node = result2.scalar_one_or_none()
    if not node:
        raise HTTPException(status_code=404, detail="Node not found")

    # Fetch adaptive progress
    diff_adj = await adaptive_service.get_difficulty_adjustment(current_user.id, db)
    topics = await adaptive_service.get_revision_topics(current_user.id, db)
    weak_areas = [t["concept"] for t in topics] if topics else None

    # AI generates lesson content
    lesson_data = await ai_service.generate_lesson(
        language=data.language,
        topic=data.topic,
        skill_level=data.skill_level,
        weak_areas=weak_areas,
        difficulty_adjustment=diff_adj,
    )

    # Persist lesson
    lesson = Lesson(
        node_id=data.node_id,
        title=lesson_data.get("title", f"Lesson: {data.topic}"),
        theory_content=lesson_data.get("theory_content", "Oops! The AI didn't generate the theory content. Please try again!"),
        summary=lesson_data.get("summary", "Learn about this topic."),
        difficulty=lesson_data.get("difficulty", "easy"),
        xp_reward=30,
        estimated_minutes=lesson_data.get("estimated_minutes", 10),
    )
    db.add(lesson)
    await db.flush()

    lang_id = JUDGE0_LANGUAGE_IDS.get(data.language, 71)

    # Get exercises or inject a fallback if the AI cut off early
    exercises_data = lesson_data.get("exercises", [])
    if not exercises_data:
        exercises_data = [{
            "type": "mcq",
            "question": f"What is the main focus of '{data.topic}'?",
            "options": [f"A) {data.topic}", "B) Something completely unrelated", "C) I'm not sure", "D) None of the above"],
            "correct_answer": f"A) {data.topic}",
            "explanation": "This is exactly what we just learned about!",
            "hint": "Check the title of the lesson."
        }]

    # Persist exercises
    for i, ex_data in enumerate(exercises_data):
        exercise = Exercise(
            lesson_id=lesson.id,
            type=ex_data.get("type", "mcq"),
            question=ex_data.get("question", "A question was omitted."),
            options=ex_data.get("options"),
            correct_answer=ex_data.get("correct_answer", ""),
            explanation=ex_data.get("explanation", ""),
            hint=ex_data.get("hint", ""),
            starter_code=ex_data.get("starter_code"),
            test_cases=ex_data.get("test_cases"),
            order=i,
            xp_reward=10,
            language_id=lang_id if ex_data.get("type") == "code_challenge" else None,
        )
        db.add(exercise)

    await db.commit()
    await db.refresh(lesson)
    return await _build_lesson_response(lesson, db)


@router.get("/{lesson_id}", response_model=LessonResponse)
async def get_lesson(
    lesson_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Lesson).where(Lesson.id == lesson_id))
    lesson = result.scalar_one_or_none()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return await _build_lesson_response(lesson, db)


@router.post("/{lesson_id}/submit", response_model=SubmitAnswerResponse)
async def submit_answer(
    lesson_id: int,
    data: SubmitAnswerRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Exercise).where(Exercise.id == data.exercise_id))
    exercise = result.scalar_one_or_none()
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")

    if exercise.type.value == "code_challenge":
        from app.services.ai_service import AIService
        ai_service = AIService()
        is_correct = await ai_service.verify_code_answer(
            exercise.question, exercise.correct_answer, data.answer
        )
    else:
        is_correct = data.answer.strip().lower() == exercise.correct_answer.strip().lower()

    xp_earned = exercise.xp_reward if is_correct else 0

    # Award XP if correct
    if is_correct:
        result2 = await db.execute(select(UserProfile).where(UserProfile.user_id == current_user.id))
        profile = result2.scalar_one_or_none()
        if profile:
            profile.xp += xp_earned
            profile.level = max(1, profile.xp // 500 + 1)
            db.add(XPTransaction(user_id=current_user.id, amount=xp_earned, reason="exercise_correct"))
    else:
        # Track weak area
        await adaptive_service.record_mistake(
            user_id=current_user.id,
            concept=exercise.question[:100],
            error_type="answer_wrong",
            db=db,
        )

    await db.commit()

    return SubmitAnswerResponse(
        correct=is_correct,
        xp_earned=xp_earned,
        explanation=exercise.explanation or "Keep practicing!",
        correct_answer=None if is_correct else exercise.correct_answer,
    )


@router.post("/{lesson_id}/complete")
async def complete_lesson(
    lesson_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Lesson).where(Lesson.id == lesson_id))
    lesson = result.scalar_one_or_none()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    # Update or create progress record
    result2 = await db.execute(
        select(UserProgress).where(
            UserProgress.user_id == current_user.id,
            UserProgress.lesson_id == lesson_id,
        )
    )
    progress = result2.scalar_one_or_none()
    if not progress:
        progress = UserProgress(user_id=current_user.id, lesson_id=lesson_id)
        db.add(progress)

    progress.completed = True
    progress.score = 1.0
    progress.completed_at = datetime.utcnow()
    progress.xp_earned = lesson.xp_reward
    progress.attempts = (progress.attempts or 0) + 1

    # Award lesson XP
    result3 = await db.execute(select(UserProfile).where(UserProfile.user_id == current_user.id))
    profile = result3.scalar_one_or_none()
    if profile:
        profile.xp += lesson.xp_reward
        profile.level = max(1, profile.xp // 500 + 1)
        profile.total_lessons_completed += 1
        
        now = datetime.utcnow()
        if not profile.last_active:
            profile.streak = 1
        else:
            last_date = profile.last_active.date()
            today = now.date()
            
            if last_date < today:
                # If they were active exactly yesterday, continue streak. Else reset.
                from datetime import timedelta
                if last_date == today - timedelta(days=1):
                    profile.streak += 1
                else:
                    profile.streak = 1
            elif last_date == today and profile.streak == 0:
                # Catch edge case where last_active was set to today (e.g., from old onboarding logic)
                # but the user hasn't actually earned a streak point yet.
                profile.streak = 1
                    
        profile.longest_streak = max(profile.streak, profile.longest_streak)
        profile.last_active = now

    # Unlock next node in roadmap
    node_result = await db.execute(
        select(RoadmapNode).where(RoadmapNode.id == lesson.node_id)
    )
    node = node_result.scalar_one_or_none()
    if node:
        node.status = NodeStatus.COMPLETED
        # Unlock next node
        next_result = await db.execute(
            select(RoadmapNode).where(
                RoadmapNode.roadmap_id == node.roadmap_id,
                RoadmapNode.order == node.order + 1,
            )
        )
        next_node = next_result.scalar_one_or_none()
        if next_node:
            next_node.status = NodeStatus.UNLOCKED

    db.add(XPTransaction(user_id=current_user.id, amount=lesson.xp_reward, reason="lesson_complete"))
    await db.commit()

    return {
        "message": "Lesson completed! 🎉",
        "xp_earned": lesson.xp_reward,
        "total_xp": profile.xp if profile else 0,
    }


async def _build_lesson_response(lesson: Lesson, db: AsyncSession) -> LessonResponse:
    result = await db.execute(
        select(Exercise).where(Exercise.lesson_id == lesson.id).order_by(Exercise.order)
    )
    exercises = result.scalars().all()

    return LessonResponse(
        id=lesson.id,
        title=lesson.title,
        theory_content=lesson.theory_content,
        summary=lesson.summary,
        difficulty=lesson.difficulty.value if hasattr(lesson.difficulty, 'value') else lesson.difficulty,
        xp_reward=lesson.xp_reward,
        estimated_minutes=lesson.estimated_minutes,
        exercises=[
            ExerciseResponse(
                id=e.id,
                type=e.type.value if hasattr(e.type, 'value') else e.type,
                question=e.question,
                options=e.options,
                hint=e.hint,
                starter_code=e.starter_code,
                order=e.order,
                xp_reward=e.xp_reward,
                language_id=e.language_id,
            )
            for e in exercises
        ],
    )
