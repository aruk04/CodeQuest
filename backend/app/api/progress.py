from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime, date
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User, UserProfile
from app.models.progress import UserProgress, WeakArea, XPTransaction
from app.schemas.progress import (
    ProgressSummaryResponse, WeakAreaResponse, StreakResponse, LessonProgressResponse, SolvedChallengeRequest
)

router = APIRouter(prefix="/api/progress", tags=["progress"])

XP_PER_LEVEL = 500


def xp_to_next_level(xp: int) -> int:
    current_level = xp // XP_PER_LEVEL
    return (current_level + 1) * XP_PER_LEVEL - xp


@router.get("/summary", response_model=ProgressSummaryResponse)
async def get_progress_summary(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(UserProfile).where(UserProfile.user_id == current_user.id))
    profile = result.scalar_one_or_none()

    if not profile:
        return ProgressSummaryResponse(
            xp=0, level=1, streak=0, longest_streak=0,
            total_lessons_completed=0, xp_to_next_level=XP_PER_LEVEL, completion_percent=0.0
        )

    # Calculate completion percent (XP within current level)
    xp_in_level = profile.xp % XP_PER_LEVEL
    completion_percent = (xp_in_level / XP_PER_LEVEL) * 100

    return ProgressSummaryResponse(
        xp=profile.xp,
        level=profile.level,
        streak=profile.streak,
        longest_streak=profile.longest_streak,
        total_lessons_completed=profile.total_lessons_completed,
        xp_to_next_level=xp_to_next_level(profile.xp),
        completion_percent=round(completion_percent, 1),
        solved_challenges=profile.solved_challenges if profile.solved_challenges else []
    )

@router.post("/solved-challenge", response_model=ProgressSummaryResponse)
async def mark_challenge_solved(
    data: SolvedChallengeRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(UserProfile).where(UserProfile.user_id == current_user.id))
    profile = result.scalar_one_or_none()
    
    if not profile:
        profile = UserProfile(user_id=current_user.id)
        db.add(profile)
        await db.commit()
        await db.refresh(profile)
        
    solved = profile.solved_challenges or []
    if data.challenge_id not in solved:
        solved.append(data.challenge_id)
        # SQLAlchemy JSON columns sometimes need this to detect changes
        profile.solved_challenges = list(solved)
        
        # Award XP
        profile.xp += data.xp_reward
        profile.level = max(1, profile.xp // XP_PER_LEVEL + 1)
        
        # Log XP Transaction
        tx = XPTransaction(user_id=current_user.id, amount=data.xp_reward, reason="practice_challenge")
        db.add(tx)
        
        await db.commit()
        await db.refresh(profile)
        
    return await get_progress_summary(current_user=current_user, db=db)


@router.get("/streak", response_model=StreakResponse)
async def get_streak(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(UserProfile).where(UserProfile.user_id == current_user.id))
    profile = result.scalar_one_or_none()

    if not profile:
        return StreakResponse(streak=0, longest_streak=0, last_active=None)

    # Check if streak is broken (they missed yesterday)
    today = date.today()
    if profile.last_active:
        last_active_date = profile.last_active.date()
        days_diff = (today - last_active_date).days
        
        # If they missed yesterday entirely, their streak is broken right now.
        if days_diff > 1 and profile.streak > 0:
            profile.streak = 0
            # We don't update last_active here, because they haven't actually completed anything yet!
            await db.commit()

    return StreakResponse(
        streak=profile.streak,
        longest_streak=profile.longest_streak,
        last_active=profile.last_active,
    )


@router.get("/weak-areas", response_model=list[WeakAreaResponse])
async def get_weak_areas(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(WeakArea)
        .where(WeakArea.user_id == current_user.id, WeakArea.needs_revision == True)
        .order_by(WeakArea.error_count.desc())
        .limit(10)
    )
    return result.scalars().all()


@router.get("/recent-xp")
async def get_recent_xp(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(XPTransaction)
        .where(XPTransaction.user_id == current_user.id)
        .order_by(XPTransaction.created_at.desc())
        .limit(20)
    )
    transactions = result.scalars().all()
    return [{"amount": t.amount, "reason": t.reason, "created_at": t.created_at} for t in transactions]
