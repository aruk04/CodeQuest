from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Enum as SAEnum, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.core.database import Base


class SkillLevel(str, enum.Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


class ProgrammingLanguage(str, enum.Enum):
    PYTHON = "python"
    JAVASCRIPT = "javascript"
    CPP = "cpp"
    JAVA = "java"


class LearningStyle(str, enum.Enum):
    VISUAL = "visual"
    PRACTICE_HEAVY = "practice_heavy"
    THEORY_FIRST = "theory_first"
    BALANCED = "balanced"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_onboarded = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    roadmaps = relationship("Roadmap", back_populates="user", cascade="all, delete-orphan")
    progress_records = relationship("UserProgress", back_populates="user", cascade="all, delete-orphan")
    xp_transactions = relationship("XPTransaction", back_populates="user", cascade="all, delete-orphan")
    weak_areas = relationship("WeakArea", back_populates="user", cascade="all, delete-orphan")


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    language = Column(SAEnum(ProgrammingLanguage), nullable=True)
    skill_level = Column(SAEnum(SkillLevel), default=SkillLevel.BEGINNER)
    learning_style = Column(SAEnum(LearningStyle), default=LearningStyle.BALANCED)
    goal = Column(String, nullable=True)  # e.g., "crack FAANG", "learn web dev"
    xp = Column(Integer, default=0)
    level = Column(Integer, default=1)
    streak = Column(Integer, default=0)
    longest_streak = Column(Integer, default=0)
    last_active = Column(DateTime, nullable=True)
    total_lessons_completed = Column(Integer, default=0)
    avatar_url = Column(String, nullable=True)

    # Gamification / Store
    unlocked_themes = Column(JSON, default=["vs-dark"])
    active_theme = Column(String, default="vs-dark")
    ai_hints_used_today = Column(Integer, default=0)
    last_hint_date = Column(DateTime, nullable=True)
    bonus_hints = Column(Integer, default=0)
    solved_challenges = Column(JSON, default=[])

    # Relationships
    user = relationship("User", back_populates="profile")
