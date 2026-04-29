from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Float, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base


class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    completed = Column(Boolean, default=False)
    score = Column(Float, default=0.0)         # 0.0 - 1.0
    attempts = Column(Integer, default=0)
    xp_earned = Column(Integer, default=0)
    time_spent_seconds = Column(Integer, default=0)
    last_attempt = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    mistakes = Column(Integer, default=0)

    # Relationships
    user = relationship("User", back_populates="progress_records")
    lesson = relationship("Lesson", back_populates="progress_records")


class XPTransaction(Base):
    __tablename__ = "xp_transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount = Column(Integer, nullable=False)
    reason = Column(String, nullable=False)  # e.g., "lesson_complete", "streak_bonus"
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="xp_transactions")


class WeakArea(Base):
    __tablename__ = "weak_areas"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    concept = Column(String, nullable=False)
    error_count = Column(Integer, default=1)
    last_seen = Column(DateTime, default=datetime.utcnow)
    error_type = Column(String, nullable=True)   # "logic", "syntax", "understanding"
    needs_revision = Column(Boolean, default=True)
    resources = Column(JSON, nullable=True)

    # Relationships
    user = relationship("User", back_populates="weak_areas")
