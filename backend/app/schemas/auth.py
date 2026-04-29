from pydantic import BaseModel, EmailStr
from typing import Optional


class RegisterRequest(BaseModel):
    email: EmailStr
    username: str
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    username: str
    is_onboarded: bool


class UserMeResponse(BaseModel):
    id: int
    email: str
    username: str
    is_onboarded: bool

    class Config:
        from_attributes = True
