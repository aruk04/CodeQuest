from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.core.security import get_current_user
from app.models.user import User
from app.services.code_service import CodeService

router = APIRouter(prefix="/api/code", tags=["code"])
code_service = CodeService()

LANGUAGE_IDS = {
    "python": 71,
    "javascript": 63,
    "cpp": 54,
    "java": 62,
}


class RunCodeRequest(BaseModel):
    code: str
    language: str
    stdin: Optional[str] = ""


class ValidateCodeRequest(BaseModel):
    code: str
    language: str
    expected_output: str
    stdin: Optional[str] = ""


@router.post("/run")
async def run_code(
    data: RunCodeRequest,
    current_user: User = Depends(get_current_user),
):
    result = await code_service.run_code(
        code=data.code,
        language=data.language,
        stdin=data.stdin,
    )
    return result


@router.post("/validate")
async def validate_code(
    data: ValidateCodeRequest,
    current_user: User = Depends(get_current_user),
):
    result = await code_service.validate_code(
        code=data.code,
        language=data.language,
        expected_output=data.expected_output,
        stdin=data.stdin,
    )
    return result
