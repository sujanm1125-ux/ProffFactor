"""SQLAlchemy models for AegisBid.

PRIVACY ARCHITECTURE:
Only public ledger commitments, nullifiers, transaction IDs, public auction metadata,
and disclosure summaries are persisted. No private witnesses, secrets, seeds, or confidential
bid amounts are stored in this database.
"""
from datetime import datetime, timezone
import uuid
from sqlalchemy import BigInteger, Column, DateTime, String, Text
from .database import Base


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class PublicAuction(Base):
    __tablename__ = "public_auctions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    auction_id_hex = Column(String(66), unique=True, nullable=False, index=True)
    title = Column(String(128), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(64), nullable=False, default="procurement")
    reserve_price = Column(BigInteger, nullable=False)
    currency = Column(String(16), nullable=False, default="tDUST")
    bidding_deadline_block = Column(BigInteger, nullable=False)
    seller_identity_hex = Column(String(66), nullable=False)
    status = Column(String(24), nullable=False, default="Open", index=True)
    
    # Publicly revealed outcomes upon settlement only
    highest_commitment_hex = Column(String(66), nullable=True)
    cleared_amount = Column(BigInteger, nullable=True)
    winner_identity_hex = Column(String(66), nullable=True)
    
    contract_address = Column(String(128), nullable=True)
    network = Column(String(24), nullable=False, default="preprod")
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)


class ProofReceipt(Base):
    __tablename__ = "proof_receipts"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    auction_id_hex = Column(String(66), nullable=False, index=True)
    transaction_id = Column(String(128), unique=True, nullable=False, index=True)
    commitment_hex = Column(String(66), nullable=False)
    nullifier_hex = Column(String(66), nullable=False, index=True)
    circuit_name = Column(String(64), nullable=False)
    proof_outcome = Column(String(32), nullable=False, default="finalized")
    block_height = Column(BigInteger, nullable=True)
    network = Column(String(24), nullable=False, default="preprod")
    disclosure_scope = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)


class AggregateMetric(Base):
    __tablename__ = "aggregate_metrics"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    metric_key = Column(String(64), unique=True, nullable=False, index=True)
    metric_value = Column(BigInteger, nullable=False, default=0)
    category = Column(String(32), nullable=False, default="system")
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False)
