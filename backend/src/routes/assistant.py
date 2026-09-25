"""Assistant route for privacy-preserving proof planning."""
from fastapi import APIRouter
from ..gemini_service import generate_proof_plan
from ..schemas import GeminiPlanRequest, GeminiPlanResponse

router = APIRouter(prefix="/api/assistant", tags=["Assistant"])


@router.post("/plan", response_model=GeminiPlanResponse)
async def create_procurement_plan(request: GeminiPlanRequest):
    """Analyze a public RFP or auction specification and generate a zero-knowledge proof plan.
    
    PRIVACY BOUNDARY:
    Input is scrubbed of any secret tokens. Gemini never receives participant private keys,
    secrets, seeds, or private bid amounts.
    """
    return await generate_proof_plan(request)
