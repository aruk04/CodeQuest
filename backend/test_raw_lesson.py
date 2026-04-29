import asyncio
from app.services.ai_service import AIService, client, settings

async def test():
    system = """You are an expert coding teacher. Generate a complete, engaging lesson.
    Return ONLY valid JSON matching this exact structure.
    CRITICAL: You MUST properly escape all double quotes (\\") and newlines (\\\\n) inside string values, especially within the theory_content markdown blocks!
    {
      "title": "lesson title",
      "theory_content": "detailed markdown explanation with code examples using ``` code blocks ```",
      "summary": "brief 1-2 sentence summary",
      "difficulty": "easy|medium|hard",
      "estimated_minutes": 10,
      "exercises": [{"type": "mcq", "question": "Q"}]
    }"""
    user = f"Create a complete lesson for Python Lists beginner."
    
    response = await client.messages.create(
        model=settings.ANTHROPIC_MODEL,
        max_tokens=4096,
        system=system,
        messages=[{"role": "user", "content": user}],
    )
    print("--- RAW OUTPUT ---")
    print(response.content[0].text)
    print("------------------")
    print("Stop reason:", response.stop_reason)

if __name__ == "__main__":
    asyncio.run(test())
