from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Enum as SAEnum, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.core.database import Base


class NodeStatus(str, enum.Enum):
    LOCKED = "locked"
    UNLOCKED = "unlocked"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


class Roadmap(Base):
    __tablename__ = "roadmaps"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    language = Column(String, nullable=False)
    skill_level = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="roadmaps")
    nodes = relationship("RoadmapNode", back_populates="roadmap", cascade="all, delete-orphan", order_by="RoadmapNode.order")


class RoadmapNode(Base):
    __tablename__ = "roadmap_nodes"

    id = Column(Integer, primary_key=True, index=True)
    roadmap_id = Column(Integer, ForeignKey("roadmaps.id"), nullable=False)
    parent_id = Column(Integer, ForeignKey("roadmap_nodes.id"), nullable=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    icon = Column(String, default="📚")
    order = Column(Integer, default=0)
    xp_reward = Column(Integer, default=50)
    status = Column(SAEnum(NodeStatus), default=NodeStatus.LOCKED)
    estimated_minutes = Column(Integer, default=15)
    tags = Column(JSON, default=list)  # e.g., ["loops", "arrays"]

    # Relationships
    roadmap = relationship("Roadmap", back_populates="nodes")
    children = relationship("RoadmapNode", backref="parent", remote_side=[id])
    lessons = relationship("Lesson", back_populates="node", cascade="all, delete-orphan")
