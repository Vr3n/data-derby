from typing import Any
from sqlmodel import SQLModel
from sqlalchemy.ext.asyncio import (
    AsyncSession, create_async_engine, async_sessionmaker,)
from app.config import settings


engine = create_async_engine(settings.DATABASE_URL,
                             echo=True,
                             future=True)

async_session = async_sessionmaker(
    engine,
    expire_on_commit=False
)


async def get_session() -> AsyncSession:  # type: ignore
    async with async_session() as session:
        yield session  # type: ignore
