import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
from app.models.progress import WeakArea
from app.models.user import UserProfile
from app.core.database import AsyncSessionLocal
from app.services.ai_service import AIService


class AdaptiveService:
    """
    Adaptive learning engine — tracks user mistakes, detects struggle patterns,
    and provides data for adjusting lesson difficulty and content.
    """

    async def record_mistake(
        self,
        user_id: int,
        concept: str,
        error_type: str,
        db: AsyncSession,
    ):
        """Record a mistake and update weak areas."""
        result = await db.execute(
            select(WeakArea).where(
                WeakArea.user_id == user_id,
                WeakArea.concept == concept[:200],
            )
        )
        weak_area = result.scalar_one_or_none()
        is_new = False

        if weak_area:
            weak_area.error_count += 1
            weak_area.last_seen = datetime.utcnow()
            weak_area.error_type = error_type
            weak_area.needs_revision = True
        else:
            weak_area = WeakArea(
                user_id=user_id,
                concept=concept[:200],
                error_count=1,
                error_type=error_type,
                needs_revision=True,
            )
            db.add(weak_area)
            is_new = True

        await db.commit()
        
        if is_new:
            await db.refresh(weak_area)
            asyncio.create_task(self._generate_and_save_resources(weak_area.id, user_id, concept))

    async def _generate_and_save_resources(self, weak_area_id: int, user_id: int, concept: str):
        try:
            async with AsyncSessionLocal() as session:
                # Get user's language
                user_res = await session.execute(select(UserProfile).where(UserProfile.user_id == user_id))
                profile = user_res.scalar_one_or_none()
                lang = profile.language.value if profile and profile.language else "python"

                # Generate resources
                ai = AIService()
                resources = await ai.generate_resources_for_concept(concept, lang)

                if resources:
                    wa_res = await session.execute(select(WeakArea).where(WeakArea.id == weak_area_id))
                    weak_area = wa_res.scalar_one_or_none()
                    if weak_area:
                        weak_area.resources = resources
                        await session.commit()
        except Exception as e:
            import logging
            logging.error(f"Failed to generate AI resources for weak area {weak_area_id}: {e}")

    async def get_difficulty_adjustment(self, user_id: int, db: AsyncSession) -> str:
        """
        Determine if we should adjust difficulty based on recent performance.
        Returns: "easier", "same", or "harder"
        """
        result = await db.execute(
            select(WeakArea)
            .where(WeakArea.user_id == user_id, WeakArea.needs_revision == True)
            .order_by(WeakArea.error_count.desc())
        )
        weak_areas = result.scalars().all()

        total_errors = sum(w.error_count for w in weak_areas)

        if total_errors > 10:
            return "easier"
        elif total_errors < 3:
            return "harder"
        return "same"

    async def get_revision_topics(self, user_id: int, db: AsyncSession) -> list:
        """Get topics that need spaced repetition revision."""
        result = await db.execute(
            select(WeakArea)
            .where(WeakArea.user_id == user_id, WeakArea.needs_revision == True)
            .order_by(WeakArea.error_count.desc())
            .limit(5)
        )
        areas = result.scalars().all()
        return [{"concept": a.concept, "error_count": a.error_count, "error_type": a.error_type} for a in areas]


class LearningService:
    """Helper service for learning flow logic."""

    def calculate_level(self, xp: int) -> int:
        return max(1, xp // 500 + 1)

    def calculate_xp_for_lesson(self, difficulty: str, streak: int) -> int:
        base = {"easy": 20, "medium": 35, "hard": 50}.get(difficulty, 20)
        streak_bonus = min(streak * 2, 20)  # max 20 bonus XP for streak
        return base + streak_bonus
