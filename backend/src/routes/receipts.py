"""Public receipts and auctions routes."""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_db
from ..models import ProofReceipt, PublicAuction
from ..schemas import (
    AuctionCreate,
    AuctionResponse,
    ProofReceiptCreate,
    ProofReceiptResponse,
)

router = APIRouter(tags=["Auctions & Receipts"])


@router.post(
    "/api/receipts",
    response_model=ProofReceiptResponse,
    status_code=status.HTTP_201_CREATED,
)
async def record_proof_receipt(
    receipt_in: ProofReceiptCreate,
    db: AsyncSession = Depends(get_db),
):
    """Record a finalized Midnight zero-knowledge transaction receipt.
    
    PRIVACY ENFORCEMENT:
    Input is strictly validated by ProofReceiptCreate. Any attempt to send private
    witness fields (e.g. bid amount, salt, caller secret) is rejected with 422 Unprocessable Entity.
    """
    # Check for existing tx
    existing = await db.scalar(
        select(ProofReceipt).where(ProofReceipt.transaction_id == receipt_in.transaction_id)
    )
    if existing:
        return existing

    receipt = ProofReceipt(
        auction_id_hex=receipt_in.auction_id_hex,
        transaction_id=receipt_in.transaction_id,
        commitment_hex=receipt_in.commitment_hex,
        nullifier_hex=receipt_in.nullifier_hex,
        circuit_name=receipt_in.circuit_name,
        proof_outcome=receipt_in.proof_outcome,
        block_height=receipt_in.block_height,
        network=receipt_in.network,
        disclosure_scope=receipt_in.disclosure_scope,
    )
    db.add(receipt)
    await db.flush()
    await db.refresh(receipt)
    return receipt


@router.get("/api/receipts", response_model=List[ProofReceiptResponse])
async def list_proof_receipts(
    auction_id_hex: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve public zero-knowledge proof receipts."""
    stmt = select(ProofReceipt).order_by(desc(ProofReceipt.created_at)).limit(limit)
    if auction_id_hex:
        stmt = stmt.where(ProofReceipt.auction_id_hex == auction_id_hex)
    result = await db.scalars(stmt)
    return list(result.all())


@router.post(
    "/api/auctions",
    response_model=AuctionResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_public_auction(
    auction_in: AuctionCreate,
    db: AsyncSession = Depends(get_db),
):
    """Register public metadata for a Midnight sealed-bid auction."""
    existing = await db.scalar(
        select(PublicAuction).where(PublicAuction.auction_id_hex == auction_in.auction_id_hex)
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Auction with this ID is already registered.",
        )

    auction = PublicAuction(
        auction_id_hex=auction_in.auction_id_hex,
        title=auction_in.title,
        description=auction_in.description,
        category=auction_in.category,
        reserve_price=auction_in.reserve_price,
        currency=auction_in.currency,
        bidding_deadline_block=auction_in.bidding_deadline_block,
        seller_identity_hex=auction_in.seller_identity_hex,
        contract_address=auction_in.contract_address,
        network=auction_in.network,
        status="Open",
    )
    db.add(auction)
    await db.flush()
    await db.refresh(auction)
    return auction


@router.get("/api/auctions", response_model=List[AuctionResponse])
async def list_public_auctions(
    status_filter: Optional[str] = Query(None, alias="status"),
    db: AsyncSession = Depends(get_db),
):
    """List registered public auctions."""
    stmt = select(PublicAuction).order_by(desc(PublicAuction.created_at))
    if status_filter:
        stmt = stmt.where(PublicAuction.status == status_filter)
    result = await db.scalars(stmt)
    return list(result.all())


@router.get("/api/auctions/{auction_id_hex}", response_model=AuctionResponse)
async def get_auction_by_id(
    auction_id_hex: str,
    db: AsyncSession = Depends(get_db),
):
    """Get single auction details."""
    auction = await db.scalar(
        select(PublicAuction).where(PublicAuction.auction_id_hex == auction_id_hex)
    )
    if not auction:
        raise HTTPException(status_code=404, detail="Auction not found")
    return auction
