from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import SQLModel, select
from app.database import get_session
from app.models import Competition, Country

router = APIRouter(
    prefix="/competitions",
    tags=["competitions"],
    responses={
        404: {"description": "Not Found"}
    }
)


class CompetitionResponseSchema(SQLModel):
    competitions: Competition
    country: Country


@router.get('/', response_model=List[CompetitionResponseSchema])
async def get_all_competitions(
    session: AsyncSession = Depends(get_session)
):
    query = (
        select(
            Competition,
            Country
        )
        .join(Country)
    )

    result = await session.execute(query)

    return result.all()
