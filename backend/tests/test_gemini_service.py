import pytest
from src.gemini_service import (
    compute_request_hash,
    generate_proof_plan,
    get_deterministic_fallback,
    sanitize_public_prompt,
)
from src.schemas import GeminiPlanRequest


def test_sanitize_public_prompt_scrubs_hex_secrets():
    # 64-char hex string (e.g. private key / seed)
    raw = "Please verify RFQ with private key 4f8b2c1d9e3a7f6b5c4d3e2a1f0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b."
    sanitized = sanitize_public_prompt(raw)
    assert "4f8b2c1d" not in sanitized
    assert "[REDACTED_HEX_KEY]" in sanitized


def test_sanitize_public_prompt_scrubs_confidential_valuations():
    raw = "Supplier proposal: my bid amount is $450,000 for batch procurement."
    sanitized = sanitize_public_prompt(raw)
    assert "450,000" not in sanitized
    assert "[REDACTED_CONFIDENTIAL_VALUATION]" in sanitized


def test_deterministic_fallback_guarantees_privacy_invariants():
    req = GeminiPlanRequest(
        public_description="Sub-orbital satellite launch slot procurement auction.",
        category="procurement",
        reserve_threshold=150000,
    )
    plan = get_deterministic_fallback(req)

    assert plan.suggested_reserve_price == 150000
    assert plan.fallback_used is True
    assert len(plan.privacy_analysis) >= 4

    # Verify that privacy analysis correctly isolates private fields
    field_map = {item.field_name: item for item in plan.privacy_analysis}
    assert "bidderSecret (32-byte secret)" in field_map
    assert field_map["bidderSecret (32-byte secret)"].visibility == "PRIVATE"
    assert field_map["bidAmount (Micro-DUST)"].visibility == "PRIVATE"
    assert field_map["bidCommitment (32-byte hash)"].visibility == "PUBLIC"
    assert field_map["bidNullifier (32-byte hash)"].visibility == "PUBLIC"


@pytest.mark.asyncio
async def test_generate_proof_plan_safe_execution():
    req = GeminiPlanRequest(
        public_description="Hardware security module batch purchase RFP with minimum quality gate.",
        category="procurement",
        reserve_threshold=75000,
    )
    res = await generate_proof_plan(req)
    assert res.suggested_reserve_price == 75000
    assert len(res.privacy_analysis) > 0
    assert "AegisBid" in res.recommended_title
