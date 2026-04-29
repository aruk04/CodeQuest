from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User, UserProfile
from app.models.progress import XPTransaction

router = APIRouter(prefix="/api/store", tags=["store"])

class BuyThemeRequest(BaseModel):
    theme_id: str

class SetThemeRequest(BaseModel):
    theme_id: str

@router.post("/buy-hint")
async def buy_hint(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(UserProfile).where(UserProfile.user_id == current_user.id))
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    if profile.xp < 50:
        raise HTTPException(status_code=400, detail="Not enough XP to buy a hint. You need 50 XP.")

    profile.xp -= 50
    profile.bonus_hints += 1

    # Record transaction
    tx = XPTransaction(user_id=current_user.id, amount=-50, reason="Bought AI Hint")
    db.add(tx)
    await db.commit()

    return {"message": "Hint purchased successfully", "xp": profile.xp, "bonus_hints": profile.bonus_hints}

@router.post("/buy-theme")
async def buy_theme(
    data: BuyThemeRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(UserProfile).where(UserProfile.user_id == current_user.id))
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    if data.theme_id in profile.unlocked_themes:
        raise HTTPException(status_code=400, detail="Theme already unlocked")

    if profile.xp < 10:
        raise HTTPException(status_code=400, detail="Not enough XP to buy a theme. You need 10 XP.")

    profile.xp -= 10
    
    # Needs to copy list to trigger sqlalchemy JSON mutation
    unlocked = list(profile.unlocked_themes)
    unlocked.append(data.theme_id)
    profile.unlocked_themes = unlocked
    
    profile.active_theme = data.theme_id

    # Record transaction
    tx = XPTransaction(user_id=current_user.id, amount=-10, reason=f"Bought theme: {data.theme_id}")
    db.add(tx)
    await db.commit()

    return {"message": "Theme purchased successfully", "xp": profile.xp, "unlocked_themes": profile.unlocked_themes, "active_theme": profile.active_theme}

@router.post("/set-theme")
async def set_theme(
    data: SetThemeRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(UserProfile).where(UserProfile.user_id == current_user.id))
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    if data.theme_id not in profile.unlocked_themes:
        raise HTTPException(status_code=403, detail="You have not unlocked this theme yet.")

    profile.active_theme = data.theme_id
    await db.commit()

    return {"message": "Theme updated", "active_theme": profile.active_theme}
