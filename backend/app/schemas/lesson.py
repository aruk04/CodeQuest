from pydantic import BaseModel
from typing import Optional, List, Any


class ExerciseResponse(BaseModel):
    id: int
    type: str
    question: str
    options: Optional[List[str]]
    hint: Optional[str]
    starter_code: Optional[str]
    order: int
    xp_reward: int
    language_id: Optional[int]

    class Config:
        from_attributes = True


class LessonResponse(BaseModel):
    id: int
    title: str
    theory_content: Optional[str]
    summary: Optional[str]
    difficulty: str
    xp_reward: int
    estimated_minutes: int
    exercises: List[ExerciseResponse]

    class Config:
        from_attributes = True


class SubmitAnswerRequest(BaseModel):
    exercise_id: int
    answer: str
    time_spent_seconds: int = 0


class SubmitAnswerResponse(BaseModel):
    correct: bool
    xp_earned: int
    explanation: str
    correct_answer: Optional[str] = None


class GenerateLessonRequest(BaseModel):
    node_id: int
    language: str
    topic: str
    skill_level: str
