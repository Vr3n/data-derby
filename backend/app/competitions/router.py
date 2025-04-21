from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.database import get_session
from app.competitions.schemas import CompetitionResponseSchema
from app.models import Competition, Country
from app.schemas import CompetitionBaseSchema, CountryBaseSchema

router = APIRouter(
    prefix="/competitions",
    tags=["competitions"],
    responses={
        404: {"description": "Not Found"}
    }
)


@router.get('/', response_model=list[CompetitionResponseSchema])
async def get_all_competitions(
    *, session: AsyncSession = Depends(get_session)
):
    query = select(
        Competition,
        Country
    ).join(
        Country
    )

    result = await session.execute(query)
    competitions = result.all()


    return [
        CompetitionResponseSchema(
            **competition.model_dump(), country=CountryBaseSchema(**country.dict()))
        for competition, country in competitions
    ]
