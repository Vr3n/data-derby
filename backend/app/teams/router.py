
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import and_, select

from app.teams.schema import (TeamDetailDataSchema, TeamResponseSchema)
from app.database import get_session
from app.models import CompetitionTeamStats, Team
from app.schemas import TeamBaseSchema


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


@router.get("/{team_id}", response_model=TeamResponseSchema)
async def get_team(
    *, session: AsyncSession = Depends(get_session),
    team_id
):
    query = select(
        Team
    ).where(
        Team.fbref_id == team_id
    )

    result = await session.execute(query)

    team = result.first()

    if not team:
        raise HTTPException(status_code=404,
                            detail="Team not found.")

    return TeamResponseSchema(
        **team[0].model_dump(),
    )


@router.get("/{team_id}/{season}",
            response_model=list[TeamDetailDataSchema])
async def get_team_statistics(
    *,
    session: AsyncSession = Depends(get_session),
    team_id: str,
    season: str
):
    competition_query = select(
        CompetitionTeamStats,
        Team
    ).join(
        Team
    ).where(
        and_(
            Team.fbref_id == team_id,
            CompetitionTeamStats.season_id == season
        )
    )

    result = await session.execute(competition_query)
    data = result.all()

    if not data:
        raise HTTPException(status_code=404, detail="Team Not found.")

    return [
        TeamDetailDataSchema(
            **cts.model_dump(),
            team=TeamBaseSchema(**team.model_dump())
        ) for cts, team in data
    ]
