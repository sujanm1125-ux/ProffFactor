import pytest
from httpx import ASGITransport, AsyncClient
from src.main import app


@pytest.mark.asyncio
async def test_health_endpoints():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Test /health
        res1 = await client.get("/health")
        assert res1.status_code == 200
        data1 = res1.json()
        assert data1["status"] in ("healthy", "ok", "degraded")
        assert "AegisBid" in data1["service"]
        assert data1["privacy_guarantee"] == "zero_knowledge_unshielded_isolation"

        # Test /api/health
        res2 = await client.get("/api/health")
        assert res2.status_code == 200
        data2 = res2.json()
        assert data2["midnight_network"] in ("preprod", "preview")


@pytest.mark.asyncio
async def test_root_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.get("/")
        assert res.status_code == 200
        data = res.json()
        assert "AegisBid" in data["service"]
        assert data["health"] == "/health"
