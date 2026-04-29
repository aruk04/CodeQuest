from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Enum as SAEnum, Text, JSON, Float
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.core.database import Base


class ExerciseType(str, enum.Enum):
    MCQ = "mcq"
    FILL_IN = "fill_in"
    CODE_CHALLENGE = "code_challenge"
    TRUE_FALSE = "true_false"
    ORDER_STEPS = "order_steps"


class DifficultyLevel(str, enum.Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    node_id = Column(Integer, ForeignKey("roadmap_nodes.id"), nullable=False)
    title = Column(String, nullable=False)
    theory_content = Column(Text, nullable=True)  # Markdown content
    summary = Column(Text, nullable=True)
    difficulty = Column(SAEnum(DifficultyLevel), default=DifficultyLevel.EASY)
    xp_reward = Column(Integer, default=20)
    order = Column(Integer, default=0)
    estimated_minutes = Column(Integer, default=10)
    created_at = Column(DateTime, default=datetime.utcnow)
    ai_generated = Column(Boolean, default=True)

    # Relationships
    node = relationship("RoadmapNode", back_populates="lessons")
    exercises = relationship("Exercise", back_populates="lesson", cascade="all, delete-orphan", order_by="Exercise.order")
    progress_records = relationship("UserProgress", back_populates="lesson")


class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    type = Column(SAEnum(ExerciseType), nullable=False)
    question = Column(Text, nullable=False)
    options = Column(JSON, nullable=True)           # For MCQ: list of options
    correct_answer = Column(Text, nullable=False)   # Correct answer / expected output
    explanation = Column(Text, nullable=True)        # Why this is correct
    hint = Column(Text, nullable=True)
    starter_code = Column(Text, nullable=True)       # For code challenges
    test_cases = Column(JSON, nullable=True)         # [{"input": "...", "output": "..."}]
    order = Column(Integer, default=0)
    xp_reward = Column(Integer, default=10)
    language_id = Column(Integer, nullable=True)     # Judge0 language ID

    # Relationships
    lesson = relationship("Lesson", back_populates="exercises")
