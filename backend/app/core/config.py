from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl
from typing import List
import json


class Settings(BaseSettings):
    # App
    APP_NAME: str = "CodeQuest"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://codequest:codequest_secret@localhost:5432/codequest"

    # Redis
    REDIS_URL: str = "redis://localhost:6379"

    # Anthropic
    ANTHROPIC_API_KEY: str = ""
    ANTHROPIC_MODEL: str = "claude-3-5-sonnet-20240620"

    # Judge0 (Self-hosted, runs via Docker)
    JUDGE0_URL: str = "http://localhost:2358"

    # JWT
    SECRET_KEY: str = "change-this-secret-key-in-production-32chars!!"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 days

    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
