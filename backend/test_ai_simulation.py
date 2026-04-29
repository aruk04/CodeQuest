import asyncio
from app.services.ai_service import AIService

async def test():
    service = AIService()
    print("Simulating python code execution...")
    result = await service.simulate_code_execution("print('hello world from AI')", "python")
    print(f"Result: {result}")
    
    print("\nSimulating runtime error...")
    result = await service.simulate_code_execution("print(1/0)", "python")
    print(f"Result: {result}")

if __name__ == '__main__':
    asyncio.run(test())
