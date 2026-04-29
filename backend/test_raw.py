import asyncio
from app.services.ai_service import client, settings

async def test():
    try:
        r = await client.messages.create(
            model=settings.ANTHROPIC_MODEL,
            max_tokens=4096,
            system="You are a JSON generator. Generate a large JSON.",
            messages=[{'role': 'user', 'content': 'Generate 100 words in JSON format.'}]
        )
        print(f"Stop reason: {r.stop_reason}")
        print(f"Content: {r.content[0].text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test())


