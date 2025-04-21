
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select, join

from app.teams.schema import TeamResponseSchema
from app.database import get_session
from app.models import Country, Team
from app.schemas import CountryBaseSchema


router = APIRouter(
    prefix="/teams",
    tags=["teams"],
    responses={
        404: {"description": "Not Found"}
    }
)


@router.get("/", response_model=list[TeamResponseSchema])
async def get_all_teams(
    *, session: AsyncSession = Depends(get_session),
    limit=6
):
    query = select(
        Team
    ).limit(limit)

    result = await session.execute(query)

    teams = result.all()

    return [
        TeamResponseSchema(
            **team[0].model_dump(),
        ) for team in teams
    ]
