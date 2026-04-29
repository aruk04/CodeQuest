from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from pydantic import BaseModel
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User, UserProfile
from app.models.roadmap import Roadmap, RoadmapNode, NodeStatus
from app.schemas.roadmap import RoadmapResponse, RoadmapNodeResponse, GenerateRoadmapRequest
from app.services.ai_service import AIService
from app.services.adaptive_service import AdaptiveService

router = APIRouter(prefix="/api/roadmap", tags=["roadmap"])
ai_service = AIService()
adaptive_service = AdaptiveService()

class SwitchRoadmapRequest(BaseModel):
    level_id: str
    language: str

@router.get("/available")
async def get_available_roadmaps():
    return {
        "roadmaps": [
            {"id": "beginner", "title": "Beginner Developer", "description": "Start your coding journey here.", "min_level": 1, "icon": "🌱", "skill": "beginner"},
            {"id": "intermediate", "title": "Intermediate Engineer", "description": "Level up your skills.", "min_level": 5, "icon": "🚀", "skill": "intermediate"},
            {"id": "advanced", "title": "Advanced System Design", "description": "Master software architecture.", "min_level": 10, "icon": "🏗️", "skill": "advanced"},
            {"id": "faang", "title": "FAANG Interview Prep", "description": "Crack the coding interview.", "min_level": 10, "icon": "🏢", "skill": "advanced"},
        ]
    }

@router.post("/switch", response_model=RoadmapResponse)
async def switch_roadmap(
    data: SwitchRoadmapRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(UserProfile).where(UserProfile.user_id == current_user.id))
    profile = result.scalar_one_or_none()
    
    req_level = 10 if data.level_id in ["advanced", "faang"] else (5 if data.level_id == "intermediate" else 1)
    if profile.level < req_level:
        raise HTTPException(status_code=403, detail=f"You must be level {req_level} to unlock this roadmap.")
        
    goal_map = {
        "beginner": "Learn the basics and fundamentals.",
        "intermediate": "Build solid intermediate projects and concepts.",
        "advanced": "Focus on Advanced System Design and architecture.",
        "faang": "Focus strictly on FAANG Interview Prep and Hard DSA problems."
    }
    skill_map = {
        "beginner": "beginner",
        "intermediate": "intermediate",
        "advanced": "advanced",
        "faang": "advanced"
    }
    
    diff_adj = await adaptive_service.get_difficulty_adjustment(current_user.id, db)
    topics = await adaptive_service.get_revision_topics(current_user.id, db)
    weak_areas = [t["concept"] for t in topics] if topics else None

    roadmap_data = await ai_service.generate_roadmap(
        language=data.language,
        skill_level=skill_map.get(data.level_id, "beginner"),
        goal=goal_map.get(data.level_id, ""),
        weak_areas=weak_areas,
        difficulty_adjustment=diff_adj,
    )

    # disable old roadmaps
    await db.execute(
        update(Roadmap).where(Roadmap.user_id == current_user.id).values(is_active=False)
    )

    roadmap = Roadmap(
        user_id=current_user.id,
        language=data.language,
        skill_level=skill_map.get(data.level_id, "beginner"),
        title=roadmap_data["title"],
        description=roadmap_data["description"],
    )
    db.add(roadmap)
    await db.flush()

    for i, node_data in enumerate(roadmap_data["nodes"]):
        node = RoadmapNode(
            roadmap_id=roadmap.id,
            title=node_data["title"],
            description=node_data.get("description", ""),
            icon=node_data.get("icon", "📚"),
            order=i,
            xp_reward=node_data.get("xp_reward", 50),
            estimated_minutes=node_data.get("estimated_minutes", 15),
            tags=node_data.get("tags", []),
            status=NodeStatus.UNLOCKED if i == 0 else NodeStatus.LOCKED,
        )
        db.add(node)

    profile.goal = goal_map.get(data.level_id, profile.goal)
    profile.skill_level = skill_map.get(data.level_id, profile.skill_level)

    await db.commit()
    await db.refresh(roadmap)

    return await _build_roadmap_response(roadmap, db)

@router.get("/all")
async def get_all_roadmaps(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Roadmap).where(Roadmap.user_id == current_user.id).order_by(Roadmap.created_at.desc())
    )
    roadmaps = result.scalars().all()
    
    return {
        "roadmaps": [
            {
                "id": r.id,
                "title": r.title,
                "description": r.description,
                "language": r.language,
                "skill_level": r.skill_level,
                "is_active": r.is_active,
                "created_at": r.created_at,
            }
            for r in roadmaps
        ]
    }

@router.post("/set-active/{roadmap_id}", response_model=RoadmapResponse)
async def set_active_roadmap(
    roadmap_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Roadmap).where(Roadmap.id == roadmap_id, Roadmap.user_id == current_user.id))
    roadmap = result.scalar_one_or_none()
    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found")

    await db.execute(update(Roadmap).where(Roadmap.user_id == current_user.id).values(is_active=False))
    roadmap.is_active = True
    
    result2 = await db.execute(select(UserProfile).where(UserProfile.user_id == current_user.id))
    profile = result2.scalar_one_or_none()
    if profile:
        profile.language = roadmap.language
        profile.skill_level = roadmap.skill_level
        profile.goal = roadmap.title

    await db.commit()
    return await _build_roadmap_response(roadmap, db)

@router.post("/generate", response_model=RoadmapResponse)
async def generate_roadmap(
    data: GenerateRoadmapRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Fetch adaptive progress
    diff_adj = await adaptive_service.get_difficulty_adjustment(current_user.id, db)
    topics = await adaptive_service.get_revision_topics(current_user.id, db)
    weak_areas = [t["concept"] for t in topics] if topics else None

    # Generate via AI
    roadmap_data = await ai_service.generate_roadmap(
        language=data.language,
        skill_level=data.skill_level,
        goal=data.goal,
        weak_areas=weak_areas,
        difficulty_adjustment=diff_adj,
    )

    # disable old roadmaps
    await db.execute(update(Roadmap).where(Roadmap.user_id == current_user.id).values(is_active=False))

    # Persist roadmap
    roadmap = Roadmap(
        user_id=current_user.id,
        language=data.language,
        skill_level=data.skill_level,
        title=roadmap_data["title"],
        description=roadmap_data["description"],
    )
    db.add(roadmap)
    await db.flush()

    # Create nodes
    for i, node_data in enumerate(roadmap_data["nodes"]):
        node = RoadmapNode(
            roadmap_id=roadmap.id,
            title=node_data["title"],
            description=node_data.get("description", ""),
            icon=node_data.get("icon", "📚"),
            order=i,
            xp_reward=node_data.get("xp_reward", 50),
            estimated_minutes=node_data.get("estimated_minutes", 15),
            tags=node_data.get("tags", []),
            status=NodeStatus.UNLOCKED if i == 0 else NodeStatus.LOCKED,
        )
        db.add(node)

    # Sync profile
    result = await db.execute(select(UserProfile).where(UserProfile.user_id == current_user.id))
    profile = result.scalar_one_or_none()
    if profile:
        profile.language = data.language
        profile.skill_level = data.skill_level
        profile.goal = data.goal

    await db.commit()
    await db.refresh(roadmap)

    return await _build_roadmap_response(roadmap, db)


@router.get("/me", response_model=RoadmapResponse)
async def get_my_roadmap(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Roadmap).where(
            Roadmap.user_id == current_user.id,
            Roadmap.is_active == True,
        )
    )
    roadmap = result.scalar_one_or_none()
    if not roadmap:
        raise HTTPException(status_code=404, detail="No active roadmap found. Please complete onboarding.")
    return await _build_roadmap_response(roadmap, db)


@router.get("/next-lesson")
async def get_next_lesson(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Roadmap).where(
            Roadmap.user_id == current_user.id,
            Roadmap.is_active == True,
        )
    )
    roadmap = result.scalar_one_or_none()
    if not roadmap:
        raise HTTPException(status_code=404, detail="No roadmap found")

    result2 = await db.execute(
        select(RoadmapNode).where(
            RoadmapNode.roadmap_id == roadmap.id,
            RoadmapNode.status.in_([NodeStatus.UNLOCKED, NodeStatus.IN_PROGRESS]),
        ).order_by(RoadmapNode.order)
    )
    node = result2.first()
    if not node:
        return {"message": "All lessons completed! You're a master! 🎉", "node": None}

    return {"node_id": node[0].id, "title": node[0].title, "icon": node[0].icon}


async def _build_roadmap_response(roadmap: Roadmap, db: AsyncSession) -> RoadmapResponse:
    result = await db.execute(
        select(RoadmapNode)
        .where(RoadmapNode.roadmap_id == roadmap.id)
        .order_by(RoadmapNode.order)
    )
    nodes = result.scalars().all()

    return RoadmapResponse(
        id=roadmap.id,
        title=roadmap.title,
        description=roadmap.description,
        language=roadmap.language,
        skill_level=roadmap.skill_level,
        nodes=[
            RoadmapNodeResponse(
                id=n.id,
                title=n.title,
                description=n.description,
                icon=n.icon,
                order=n.order,
                xp_reward=n.xp_reward,
                status=n.status.value,
                estimated_minutes=n.estimated_minutes,
                tags=n.tags or [],
                parent_id=n.parent_id,
                lesson_count=0,
            )
            for n in nodes
        ],
    )
