from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class ProgressSummaryResponse(BaseModel):
    xp: int
    level: int
    streak: int
    longest_streak: int
    total_lessons_completed: int
    xp_to_next_level: int
    completion_percent: float
    solved_challenges: list[int] = []


class SolvedChallengeRequest(BaseModel):
    challenge_id: int
    xp_reward: int


class WeakAreaResponse(BaseModel):
    id: int
    concept: str
    error_count: int
    error_type: Optional[str]
    needs_revision: bool
    resources: Optional[list[dict]] = None

    class Config:
        from_attributes = True


class StreakResponse(BaseModel):
    streak: int
    longest_streak: int
    last_active: Optional[datetime]


class AwardXPRequest(BaseModel):
    user_id: int
    amount: int
    reason: str


class LessonProgressResponse(BaseModel):
    lesson_id: int
    completed: bool
    score: float
    attempts: int
    xp_earned: int

    class Config:
        from_attributes = True
