"""Public metrics and aggregation endpoints."""
from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from ..config import settings
from ..database import get_db
from ..models import ProofReceipt, PublicAuction
from ..schemas import MetricsResponse

router = APIRouter(prefix="/api/metrics", tags=["Metrics"])


@router.get("", response_model=MetricsResponse)
async def get_public_metrics(db: AsyncSession = Depends(get_db)):
    """Aggregate public auction statistics and verified zero-knowledge proof metrics."""
    # Count auctions by status
    total_auctions_q = select(func.count(PublicAuction.id))
    total_auctions = (await db.scalar(total_auctions_q)) or 0

    open_auctions_q = select(func.count(PublicAuction.id)).where(PublicAuction.status == "Open")
    open_auctions = (await db.scalar(open_auctions_q)) or 0

    settled_auctions_q = select(func.count(PublicAuction.id)).where(PublicAuction.status == "Settled")
    settled_auctions = (await db.scalar(settled_auctions_q)) or 0

    # Count sealed bids and verified receipts
    bids_q = select(func.count(ProofReceipt.id)).where(ProofReceipt.circuit_name == "submitSealedBid")
    total_sealed_bids = (await db.scalar(bids_q)) or 0

    receipts_q = select(func.count(ProofReceipt.id))
    verified_commitments_count = (await db.scalar(receipts_q)) or 0

    return MetricsResponse(
        total_auctions=total_auctions,
        open_auctions=open_auctions,
        settled_auctions=settled_auctions,
        total_sealed_bids=total_sealed_bids,
        active_network=settings.MIDNIGHT_NETWORK,
        verified_commitments_count=verified_commitments_count,
    )
