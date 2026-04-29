import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from sqlalchemy.pool import NullPool
from app.core.config import settings

async def run_migration():
    engine = create_async_engine(
        settings.DATABASE_URL,
        poolclass=NullPool,
        connect_args={
            "statement_cache_size": 0,
            "prepared_statement_cache_size": 0,
        }
    )
    async with engine.begin() as conn:
        try:
            await conn.execute(text("ALTER TABLE weak_areas ADD COLUMN resources JSONB;"))
            print("Successfully added 'resources' column to weak_areas table.")
        except Exception as e:
            if "already exists" in str(e):
                print("Column 'resources' already exists.")
            else:
                print(f"Error: {e}")

if __name__ == '__main__':
    asyncio.run(run_migration())
