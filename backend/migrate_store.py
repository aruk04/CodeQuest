import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from app.core.config import settings

async def run_migration():
    engine = create_async_engine(settings.DATABASE_URL)
    async with engine.begin() as conn:
        commands = [
            "ALTER TABLE user_profiles ADD COLUMN unlocked_themes JSONB DEFAULT '[\"vs-dark\"]'::jsonb;",
            "ALTER TABLE user_profiles ADD COLUMN active_theme VARCHAR DEFAULT 'vs-dark';",
            "ALTER TABLE user_profiles ADD COLUMN ai_hints_used_today INTEGER DEFAULT 0;",
            "ALTER TABLE user_profiles ADD COLUMN last_hint_date TIMESTAMP;",
            "ALTER TABLE user_profiles ADD COLUMN bonus_hints INTEGER DEFAULT 0;",
        ]
        for cmd in commands:
            try:
                await conn.execute(text(cmd))
                print(f"Executed: {cmd}")
            except Exception as e:
                if "already exists" in str(e):
                    print(f"Column already exists: {cmd.split(' ')[5]}")
                else:
                    print(f"Error on {cmd}: {e}")

if __name__ == '__main__':
    asyncio.run(run_migration())
