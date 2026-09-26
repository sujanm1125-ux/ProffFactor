"""Configuration settings for AegisBid backend."""
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings with environment override and safe development defaults."""
    
    PROJECT_NAME: str = "AegisBid Privacy Engine"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    
    # Database configuration (Neon Postgres with SQLite dev fallback)
    DATABASE_URL: str = "sqlite+aiosqlite:///./aegisbid.db"
    DIRECT_DATABASE_URL: str = "sqlite:///./aegisbid.db"
    
    # Midnight network parameters
    MIDNIGHT_NETWORK: str = "preprod"
    PROOF_SERVER_URL: str = "http://127.0.0.1:6300"
    CONTRACT_ADDRESS: str = ""
    
    # Gemini API configuration (server-side only)
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-2.5-flash"
    
    # CORS origins
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5175",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://proff-factor-5674jjdnn-sm-17fa.vercel.app",
    ]
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
