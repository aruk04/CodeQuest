import asyncio
from httpx import AsyncClient
from app.main import app
from app.core.database import SessionLocal
from app.models.user import User
from app.core.security import create_access_token
from sqlalchemy import select

async def main():
    async with SessionLocal() as db:
        result = await db.execute(select(User).limit(1))
        user = result.scalar_one_or_none()
        if not user:
            print("No user found")
            return
            
        access_token = create_access_token(data={"sub": user.username})
        
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post(
            "/api/roadmap/generate",
            headers={"Authorization": f"Bearer {access_token}"},
            json={"language": "python", "skill_level": "beginner", "goal": ""}
        )
        print(response.status_code)
        print(response.text)

asyncio.run(main())
