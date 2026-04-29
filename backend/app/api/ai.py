from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import Optional, List
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.services.ai_service import AIService

router = APIRouter(prefix="/api/ai", tags=["ai"])
ai_service = AIService()


class ExplainRequest(BaseModel):
    concept: str
    language: str
    skill_level: str = "beginner"


class HintRequest(BaseModel):
    question: str
    language: str
    user_answer: Optional[str] = None


class FeedbackRequest(BaseModel):
    question: str
    correct_answer: str
    user_answer: str
    language: str


class DebugRequest(BaseModel):
    code: str
    language: str
    error_message: Optional[str] = None


class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    language: str
    context: Optional[str] = None


class MascotFeedbackRequest(BaseModel):
    code: str
    language: str
    question: Optional[str] = None
    solved: bool = False


@router.post("/explain")
async def explain_concept(
    data: ExplainRequest,
    current_user: User = Depends(get_current_user),
):
    explanation = await ai_service.explain_concept(
        concept=data.concept,
        language=data.language,
        skill_level=data.skill_level,
    )
    return {"explanation": explanation}


@router.post("/mascot-feedback")
async def get_mascot_feedback(
    data: MascotFeedbackRequest,
    current_user: User = Depends(get_current_user),
):
    feedback = await ai_service.get_mascot_feedback(
        code=data.code,
        language=data.language,
        question=data.question,
        solved=data.solved,
    )
    return feedback


@router.post("/hint")
async def get_hint(
    data: HintRequest,
    current_user: User = Depends(get_current_user),
):
    hint = await ai_service.get_hint(
        question=data.question,
        language=data.language,
        user_answer=data.user_answer,
    )
    return {"hint": hint}


@router.post("/feedback")
async def get_feedback(
    data: FeedbackRequest,
    current_user: User = Depends(get_current_user),
):
    feedback = await ai_service.get_feedback(
        question=data.question,
        correct_answer=data.correct_answer,
        user_answer=data.user_answer,
        language=data.language,
    )
    return {"feedback": feedback}


@router.post("/debug")
async def debug_code(
    data: DebugRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    from sqlalchemy import select
    from app.models.user import UserProfile
    from datetime import date, datetime

    # Get user profile for quotas
    result = await db.execute(select(UserProfile).where(UserProfile.user_id == current_user.id))
    profile = result.scalar_one_or_none()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    today = date.today()
    if not profile.last_hint_date or profile.last_hint_date.date() < today:
        profile.ai_hints_used_today = 0
        profile.last_hint_date = datetime.utcnow()

    # Check quotas
    if profile.ai_hints_used_today < 3:
        profile.ai_hints_used_today += 1
    elif profile.bonus_hints > 0:
        profile.bonus_hints -= 1
    else:
        raise HTTPException(
            status_code=403, 
            detail="You have run out of AI hints! Earn more XP and buy a hint in the Store."
        )

    profile.last_hint_date = datetime.utcnow()
    await db.commit()

    result = await ai_service.debug_code(
        code=data.code,
        language=data.language,
        error_message=data.error_message,
    )
    return result


@router.post("/chat")
async def chat_with_tutor(
    data: ChatRequest,
    current_user: User = Depends(get_current_user),
):
    response = await ai_service.chat(
        messages=[{"role": m.role, "content": m.content} for m in data.messages],
        language=data.language,
        context=data.context,
    )
    return {"message": response}
