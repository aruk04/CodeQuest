import httpx
import base64
import asyncio
from typing import Optional
from app.core.config import settings
from app.services.ai_service import AIService


class CodeService:
    """
    Code execution via AI simulation (bypassing Judge0 limitations).
    """

    def __init__(self):
        self.ai_service = AIService()

    async def run_code(self, code: str, language: str, stdin: str = "") -> dict:
        """Submit code to AI simulator and map to expected format."""
        
        # We append stdin to the code as a comment for the AI to understand it
        if stdin:
            code += f"\n\n/* STDIN PROVIDED: {stdin} */\n"

        result = await self.ai_service.simulate_code_execution(code, language)
        
        stdout = result.get("stdout", "")
        error = result.get("error", "")

        return {
            "status": "Accepted" if not error else "Error",
            "status_id": 3 if not error else 4,
            "stdout": stdout,
            "stderr": error if error else "",
            "compile_output": "",
            "time": "0.1",
            "memory": "1000",
            "error": error if error else None,
        }

    async def validate_code(
        self,
        code: str,
        language: str,
        expected_output: str,
        stdin: str = "",
    ) -> dict:
        result = await self.run_code(code, language, stdin)
        actual_output = (result.get("stdout") or "").strip()
        expected = expected_output.strip()

        is_correct = actual_output == expected
        return {
            **result,
            "is_correct": is_correct,
            "expected_output": expected,
            "actual_output": actual_output,
            "xp_earned": 20 if is_correct else 0,
        }
