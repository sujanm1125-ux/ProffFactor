import pytest
from httpx import ASGITransport, AsyncClient
from src.main import app


@pytest.mark.asyncio
async def test_metrics_aggregation_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.get("/api/metrics")
        assert res.status_code == 200
        metrics = res.json()
        assert "total_auctions" in metrics
        assert "open_auctions" in metrics
        assert "settled_auctions" in metrics
        assert "total_sealed_bids" in metrics
        assert "active_network" in metrics
        assert "verified_commitments_count" in metrics
        assert metrics["total_auctions"] >= 0
