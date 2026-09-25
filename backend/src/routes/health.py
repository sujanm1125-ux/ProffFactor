"""Health and diagnostic routes."""
from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from ..config import settings
from ..database import get_db

router = APIRouter(tags=["Health"])


@router.get("/health")
@router.get("/api/health")
async def health_check(db: AsyncSession = Depends(get_db)):
    """Health endpoint reporting application, database, and Midnight network status."""
    db_status = "ok"
    try:
        await db.execute(text("SELECT 1"))
    except Exception as exc:
        db_status = f"unhealthy: {type(exc).__name__}"

    return {
        "status": "healthy" if db_status == "ok" else "degraded",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "midnight_network": settings.MIDNIGHT_NETWORK,
        "proof_server": settings.PROOF_SERVER_URL,
        "database": db_status,
        "gemini_assistant": "configured" if bool(settings.GEMINI_API_KEY) else "deterministic_fallback_mode",
        "privacy_guarantee": "zero_knowledge_unshielded_isolation",
    }
