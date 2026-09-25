"""Pydantic schemas and privacy boundary validators for AegisBid."""
from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict, Field, model_validator

# Known forbidden private keys that must NEVER be accepted in public payloads
FORBIDDEN_PRIVATE_KEYS = {
    "bid_amount",
    "amount",
    "secret",
    "caller_secret",
    "bidder_secret",
    "user_secret",
    "salt",
    "witness",
    "private_key",
    "seed",
    "mnemonic",
    "raw_bid",
    "confidential_valuation",
}


class PrivacyEnforcedBaseModel(BaseModel):
    """Base model that rejects any attempt to inject known confidential fields."""
    
    @model_validator(mode="before")
    @classmethod
    def reject_confidential_witnesses(cls, data: Any) -> Any:
        if isinstance(data, dict):
            lowered_keys = {str(k).lower().strip() for k in data.keys()}
            violations = lowered_keys.intersection(FORBIDDEN_PRIVATE_KEYS)
            if violations:
                raise ValueError(
                    f"Privacy boundary violation: Public receipt payload contains forbidden confidential field(s): {sorted(list(violations))}. "
                    "Private witness values must remain exclusively in the client's local wallet environment."
                )
        return data


class AuctionCreate(PrivacyEnforcedBaseModel):
    auction_id_hex: str = Field(..., min_length=64, max_length=66, description="32-byte hex ID")
    title: str = Field(..., min_length=3, max_length=128)
    description: str = Field(..., min_length=5, max_length=1000)
    category: str = Field(default="procurement")
    reserve_price: int = Field(..., gt=0, description="Minimum reserve price in micro-DUST")
    currency: str = Field(default="tDUST")
    bidding_deadline_block: int = Field(..., gt=0)
    seller_identity_hex: str = Field(..., min_length=64, max_length=66)
    contract_address: Optional[str] = None
    network: str = Field(default="preprod")


class AuctionResponse(BaseModel):
    id: str
    auction_id_hex: str
    title: str
    description: str
    category: str
    reserve_price: int
    currency: str
    bidding_deadline_block: int
    seller_identity_hex: str
    status: str
    highest_commitment_hex: Optional[str] = None
    cleared_amount: Optional[int] = None
    winner_identity_hex: Optional[str] = None
    contract_address: Optional[str] = None
    network: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProofReceiptCreate(PrivacyEnforcedBaseModel):
    auction_id_hex: str = Field(..., min_length=64, max_length=66)
    transaction_id: str = Field(..., min_length=10, max_length=128)
    commitment_hex: str = Field(..., min_length=64, max_length=66)
    nullifier_hex: str = Field(..., min_length=64, max_length=66)
    circuit_name: str = Field(..., min_length=3, max_length=64)
    proof_outcome: str = Field(default="finalized")
    block_height: Optional[int] = None
    network: str = Field(default="preprod")
    disclosure_scope: str = Field(..., description="JSON or description of public disclosures")


class ProofReceiptResponse(BaseModel):
    id: str
    auction_id_hex: str
    transaction_id: str
    commitment_hex: str
    nullifier_hex: str
    circuit_name: str
    proof_outcome: str
    block_height: Optional[int] = None
    network: str
    disclosure_scope: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class MetricsResponse(BaseModel):
    total_auctions: int
    open_auctions: int
    settled_auctions: int
    total_sealed_bids: int
    active_network: str
    verified_commitments_count: int


class GeminiPlanRequest(BaseModel):
    """Public RFP/Procurement text to be analyzed by Gemini for proof planning."""
    public_description: str = Field(..., min_length=10, max_length=2000)
    category: str = Field(default="procurement")
    reserve_threshold: Optional[int] = None


class DisclosureFieldExplanation(BaseModel):
    field_name: str
    visibility: str  # "PRIVATE" or "PUBLIC"
    storage_location: str  # "Local Client Memory" or "Midnight Public Ledger"
    zk_justification: str


class GeminiPlanResponse(BaseModel):
    """Structured output from Gemini with guaranteed privacy boundary adherence."""
    recommended_title: str
    auction_category: str
    suggested_reserve_price: int
    proof_plan_summary: str
    privacy_analysis: List[DisclosureFieldExplanation]
    compliance_notes: str
    fallback_used: bool = False
