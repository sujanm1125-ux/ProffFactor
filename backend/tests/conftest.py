import pytest_asyncio
from src.database import Base, engine


@pytest_asyncio.fixture(scope="session", autouse=True)
async def setup_test_database():
    """Ensure clean database schema is created prior to test executions."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
