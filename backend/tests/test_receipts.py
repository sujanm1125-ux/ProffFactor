import pytest
from httpx import ASGITransport, AsyncClient
from pydantic import ValidationError
from src.main import app
from src.schemas import ProofReceiptCreate


def test_schema_rejects_forbidden_private_fields():
    # Attempt to submit a receipt containing raw bid amount or private witness
    payload = {
        "auction_id_hex": "0x" + "a" * 64,
        "transaction_id": "tx_mock_hash_1234567890",
        "commitment_hex": "0x" + "b" * 64,
        "nullifier_hex": "0x" + "c" * 64,
        "circuit_name": "submitSealedBid",
        "disclosure_scope": '["commitment", "nullifier"]',
        # FORBIDDEN:
        "bid_amount": 500000,
    }
    with pytest.raises(ValidationError) as exc_info:
        ProofReceiptCreate(**payload)
    assert "Privacy boundary violation" in str(exc_info.value)
    assert "bid_amount" in str(exc_info.value)


def test_schema_rejects_forbidden_witness_salt():
    payload = {
        "auction_id_hex": "0x" + "a" * 64,
        "transaction_id": "tx_mock_hash_9876543210",
        "commitment_hex": "0x" + "b" * 64,
        "nullifier_hex": "0x" + "c" * 64,
        "circuit_name": "submitSealedBid",
        "disclosure_scope": '["commitment", "nullifier"]',
        # FORBIDDEN:
        "salt": "0x" + "e" * 64,
    }
    with pytest.raises(ValidationError) as exc_info:
        ProofReceiptCreate(**payload)
    assert "Privacy boundary violation" in str(exc_info.value)
    assert "salt" in str(exc_info.value)


@pytest.mark.asyncio
async def test_record_valid_proof_receipt_and_list():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        valid_payload = {
            "auction_id_hex": "0x" + "1" * 64,
            "transaction_id": "tx_midnight_preprod_1001",
            "commitment_hex": "0x" + "2" * 64,
            "nullifier_hex": "0x" + "3" * 64,
            "circuit_name": "submitSealedBid",
            "proof_outcome": "finalized",
            "block_height": 10520,
            "network": "preprod",
            "disclosure_scope": '{"disclosed": ["commitment", "nullifier"], "proven_in_zk": ["reserve_compliance"]}',
        }
        res = await client.post("/api/receipts", json=valid_payload)
        assert res.status_code == 201
        data = res.json()
        assert data["transaction_id"] == "tx_midnight_preprod_1001"
        assert data["circuit_name"] == "submitSealedBid"

        # List receipts
        list_res = await client.get("/api/receipts")
        assert list_res.status_code == 200
        receipts = list_res.json()
        assert any(r["transaction_id"] == "tx_midnight_preprod_1001" for r in receipts)


@pytest.mark.asyncio
async def test_create_and_get_public_auction():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        auction_payload = {
            "auction_id_hex": "0x" + "9" * 64,
            "title": "Quantum Sensor Component Liquidation",
            "description": "Sealed-bid procurement of 500 certified quantum sensor nodes.",
            "category": "liquidation",
            "reserve_price": 250000,
            "currency": "tDUST",
            "bidding_deadline_block": 2500,
            "seller_identity_hex": "0x" + "8" * 64,
            "network": "preprod",
        }
        create_res = await client.post("/api/auctions", json=auction_payload)
        assert create_res.status_code == 201
        created = create_res.json()
        assert created["title"] == "Quantum Sensor Component Liquidation"
        assert created["status"] == "Open"

        # Fetch by ID
        get_res = await client.get(f"/api/auctions/{auction_payload['auction_id_hex']}")
        assert get_res.status_code == 200
        assert get_res.json()["reserve_price"] == 250000
