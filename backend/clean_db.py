import asyncio
from app.core.database import AsyncSessionLocal
from sqlalchemy import text

async def clean():
    async with AsyncSessionLocal() as db:
        await db.execute(text("DELETE FROM weak_areas;"))
        await db.execute(text("DELETE FROM user_progress;"))
        await db.execute(text("DELETE FROM exercises;"))
        await db.execute(text("DELETE FROM lessons;"))
        await db.commit()
        print("Cleaned!")

if __name__ == "__main__":
    asyncio.run(clean())
