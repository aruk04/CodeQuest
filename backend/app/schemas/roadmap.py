from pydantic import BaseModel
from typing import Optional, List
from app.models.roadmap import NodeStatus


class RoadmapNodeResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    icon: str
    order: int
    xp_reward: int
    status: str
    estimated_minutes: int
    tags: List[str]
    parent_id: Optional[int]
    lesson_count: int = 0

    class Config:
        from_attributes = True


class RoadmapResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    language: str
    skill_level: str
    nodes: List[RoadmapNodeResponse]

    class Config:
        from_attributes = True


class GenerateRoadmapRequest(BaseModel):
    language: str
    skill_level: str
    goal: Optional[str] = None
