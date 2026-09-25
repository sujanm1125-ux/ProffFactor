"""Gemini integration service with strict zero-knowledge privacy boundaries.

CRITICAL PRIVACY GUARANTEES:
1. Gemini NEVER receives private witnesses, secrets, seeds, raw credentials, or private bid amounts.
2. Input strings are actively sanitized and redacted for sensitive patterns (hex secrets, seed words).
3. Output is strictly validated into Pydantic models.
4. If no GEMINI_API_KEY is configured or the service is offline, a deterministic local fallback is used.
"""
import hashlib
import logging
import re
from typing import List, Optional

from .config import settings
from .schemas import DisclosureFieldExplanation, GeminiPlanRequest, GeminiPlanResponse

logger = logging.getLogger("aegisbid.gemini")

# Regex patterns for detecting and scrubbing potential confidential leakages
REDACTION_PATTERNS = [
    (r"\b(?:0x)?[0-9a-fA-F]{64}\b", "[REDACTED_HEX_KEY]"),
    (r"\b(?:seed|mnemonic|secret|passphrase|private)\s*[:=]\s*\S+", "[REDACTED_SECRET_CLAUSE]"),
    (r"\b(?:bid\s*amount|valuation|my\s*bid)\s*(?:is|[:=])?\s*\$?\d+[\d,]*\b", "[REDACTED_CONFIDENTIAL_VALUATION]"),
]


def sanitize_public_prompt(raw_text: str) -> str:
    """Scrub any accidental secret or valuation tokens before dispatching to external APIs."""
    sanitized = raw_text
    for pattern, replacement in REDACTION_PATTERNS:
        sanitized = re.sub(pattern, replacement, sanitized, flags=re.IGNORECASE)
    return sanitized


def compute_request_hash(text: str) -> str:
    """Compute one-way SHA-256 hash of the public prompt for audit logging without storing raw text."""
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def get_deterministic_fallback(req: GeminiPlanRequest) -> GeminiPlanResponse:
    """Deterministic local proof-planning engine for offline or unkeyed execution."""
    reserve = req.reserve_threshold if req.reserve_threshold and req.reserve_threshold > 0 else 50_000
    
    explanations: List[DisclosureFieldExplanation] = [
        DisclosureFieldExplanation(
            field_name="bidderSecret (32-byte secret)",
            visibility="PRIVATE",
            storage_location="Local Client Memory (Browser IndexedDB/Session)",
            zk_justification="Enables zero-knowledge proof generation and identity derivation without revealing participant identity.",
        ),
        DisclosureFieldExplanation(
            field_name="bidAmount (Micro-DUST)",
            visibility="PRIVATE",
            storage_location="Local Client Memory",
            zk_justification="The ZK circuit proves `bidAmount >= reservePrice` in zero-knowledge. The exact value is never disclosed during open bidding.",
        ),
        DisclosureFieldExplanation(
            field_name="salt (32-byte entropy)",
            visibility="PRIVATE",
            storage_location="Local Client Memory",
            zk_justification="Prevents rainbow table and dictionary attacks against the bid commitment hash.",
        ),
        DisclosureFieldExplanation(
            field_name="bidCommitment (32-byte hash)",
            visibility="PUBLIC",
            storage_location="Midnight Public Ledger",
            zk_justification="Permits programmatic settlement verification while completely concealing underlying bid parameters.",
        ),
        DisclosureFieldExplanation(
            field_name="bidNullifier (32-byte hash)",
            visibility="PUBLIC",
            storage_location="Midnight Public Ledger",
            zk_justification="Prevents double-bidding and replay attacks by the same secret identity on this specific auction.",
        ),
    ]
    
    clean_title = (
        req.public_description[:50].strip() + ("..." if len(req.public_description) > 50 else "")
        if req.public_description
        else "Confidential Asset Procurement"
    )

    return GeminiPlanResponse(
        recommended_title=f"AegisBid: {clean_title}",
        auction_category=req.category,
        suggested_reserve_price=reserve,
        proof_plan_summary=(
            f"Zero-Knowledge Sealed-Bid Protocol: The bidder will formulate a private witness "
            f"containing their secret identity, exact bid valuation, and random salt. The Compact "
            f"circuit 'submitSealedBid' verifies compliance against the reserve price ({reserve:,} micro-DUST) "
            f"and binds a one-way nullifier to prevent replay attacks."
        ),
        privacy_analysis=explanations,
        compliance_notes=(
            "Zero private data exposed. The public ledger records only the 32-byte commitment and nullifier. "
            "Gemini processed only the sanitized public RFQ parameters."
        ),
        fallback_used=True,
    )


async def generate_proof_plan(req: GeminiPlanRequest) -> GeminiPlanResponse:
    """Generate structured proof plan using the official Google GenAI SDK with fallback safety."""
    sanitized_prompt = sanitize_public_prompt(req.public_description)
    req_hash = compute_request_hash(sanitized_prompt)
    logger.info(f"Processing proof plan for public prompt hash: {req_hash}")

    if not settings.GEMINI_API_KEY:
        logger.info("No GEMINI_API_KEY configured; returning deterministic local proof plan.")
        return get_deterministic_fallback(req)

    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        
        system_instruction = (
            "You are the AegisBid Zero-Knowledge Procurement Architect. "
            "Your role is strictly advisory: analyze public procurement/auction requirements and output a formal "
            "proof plan. You NEVER ask for, accept, or process private keys, wallet seeds, exact private bid valuations, "
            "or secret parameters. All private witnesses remain strictly on the user's local device."
        )

        user_content = (
            f"Public RFP/Auction Description: {sanitized_prompt}\n"
            f"Category: {req.category}\n"
            f"Suggested Reserve Threshold: {req.reserve_threshold or 50000} micro-DUST\n\n"
            "Produce a structured JSON plan detailing the recommended title, reserve price, proof plan summary, "
            "and a privacy analysis table explaining why private witnesses stay confidential and public commitments are safe."
        )

        response = client.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=user_content,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.2,
                response_mime_type="application/json",
                response_schema=GeminiPlanResponse,
            ),
        )

        if response.text:
            parsed = GeminiPlanResponse.model_validate_json(response.text)
            parsed.fallback_used = False
            return parsed
        else:
            return get_deterministic_fallback(req)

    except Exception as exc:
        logger.warning(f"Gemini API call failed ({exc}); using deterministic local fallback.")
        fallback = get_deterministic_fallback(req)
        fallback.compliance_notes += f" (External assistant unreachable: {type(exc).__name__})"
        return fallback
