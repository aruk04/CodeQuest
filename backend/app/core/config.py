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

    # Anthropic
    ANTHROPIC_API_KEY: str = ""
    ANTHROPIC_MODEL: str = "claude-3-5-sonnet-20240620"

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
# Debug log to verify the URL being used
try:
    url_parts = settings.DATABASE_URL.split("@")
    masked_url = f"{url_parts[0].split(':')[0]}://***@{url_parts[1]}"
    print(f"\n[DEBUG] Database Protocol: {settings.DATABASE_URL.split('://')[0]}")
    print(f"[DEBUG] Using URL: {masked_url}\n")
except:
    pass
