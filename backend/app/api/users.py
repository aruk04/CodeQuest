from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
from app.core.database import get_db
from app.core.security import get_current_user, hash_password, verify_password
from app.models.user import User, UserProfile
from app.schemas.user import OnboardingRequest, UserResponse, UserProfileResponse, ChangePasswordRequest

router = APIRouter(prefix="/api/users", tags=["users"])

@router.put("/password")
async def change_password(
    data: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not verify_password(data.current_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect current password")
    
    current_user.password_hash = hash_password(data.new_password)
    db.add(current_user)
    await db.commit()
    
    return {"message": "Password updated successfully"}


@router.get("/me", response_model=UserResponse)
async def get_my_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(User).where(User.id == current_user.id)
    )
    user = result.scalar_one()

    result2 = await db.execute(
        select(UserProfile).where(UserProfile.user_id == current_user.id)
    )
    profile = result2.scalar_one_or_none()

    return UserResponse(
        id=user.id,
        email=user.email,
        username=user.username,
        is_onboarded=user.is_onboarded,
        created_at=user.created_at,
        profile=UserProfileResponse(
            language=profile.language.value if profile and profile.language else None,
            skill_level=profile.skill_level.value if profile and profile.skill_level else None,
            learning_style=profile.learning_style.value if profile and profile.learning_style else None,
            goal=profile.goal if profile else None,
            xp=profile.xp if profile else 0,
            level=profile.level if profile else 1,
            streak=profile.streak if profile else 0,
            longest_streak=profile.longest_streak if profile else 0,
            total_lessons_completed=profile.total_lessons_completed if profile else 0,
            last_active=profile.last_active if profile else None,
            unlocked_themes=profile.unlocked_themes if profile and profile.unlocked_themes else ["vs-dark"],
            active_theme=profile.active_theme if profile and profile.active_theme else "vs-dark",
            ai_hints_used_today=profile.ai_hints_used_today if profile else 0,
            last_hint_date=profile.last_hint_date if profile else None,
            bonus_hints=profile.bonus_hints if profile else 0,
            solved_challenges=profile.solved_challenges if profile and profile.solved_challenges else [],
        ) if profile else None,
    )


@router.post("/onboard")
async def onboard_user(
    data: OnboardingRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(UserProfile).where(UserProfile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()
    if not profile:
        profile = UserProfile(user_id=current_user.id)
        db.add(profile)

    profile.language = data.language
    profile.skill_level = data.skill_level
    profile.learning_style = data.learning_style
    profile.goal = data.goal
    profile.last_active = None  # Ensure their first lesson triggers the streak

    current_user.is_onboarded = True
    db.add(current_user)
    await db.commit()

    return {"message": "Onboarding complete", "user_id": current_user.id}
