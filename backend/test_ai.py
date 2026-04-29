import asyncio
from app.services.ai_service import AIService

async def test():
    svc = AIService()
    res = await svc.generate_lesson("python", "Lists", "beginner")
    print(res)

if __name__ == "__main__":
    asyncio.run(test())
