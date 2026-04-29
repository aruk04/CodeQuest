import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select
from sqlalchemy.pool import NullPool
from app.models.user import UserProfile
from app.core.config import settings

async def run():
    engine = create_async_engine(
        settings.DATABASE_URL,
        poolclass=NullPool,
        connect_args={
            "statement_cache_size": 0,
            "prepared_statement_cache_size": 0,
        }
    )
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    async with async_session() as session:
        result = await session.execute(select(UserProfile))
        profiles = result.scalars().all()
        for p in profiles:
            print(f"User {p.user_id}: streak={p.streak}, last_active={p.last_active}")

asyncio.run(run())
