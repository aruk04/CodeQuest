from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.user import SkillLevel, ProgrammingLanguage, LearningStyle


class OnboardingRequest(BaseModel):
    language: ProgrammingLanguage
    skill_level: SkillLevel
    learning_style: LearningStyle = LearningStyle.BALANCED
    goal: Optional[str] = None


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


class UserProfileResponse(BaseModel):
    language: Optional[str]
    skill_level: Optional[str]
    learning_style: Optional[str]
    goal: Optional[str]
    xp: int
    level: int
    streak: int
    longest_streak: int
    total_lessons_completed: int
    last_active: Optional[datetime]
    unlocked_themes: list[str] = ["vs-dark"]
    active_theme: str = "vs-dark"
    ai_hints_used_today: int = 0
    last_hint_date: Optional[datetime] = None
    bonus_hints: int = 0
    solved_challenges: list[int] = []

    class Config:
        from_attributes = True


class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    is_onboarded: bool
    created_at: datetime
    profile: Optional[UserProfileResponse]

    class Config:
        from_attributes = True
