from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import and_, select

from app.database import get_session
from app.competitions.schemas import CompetitionDetailDataSchema, CompetitionResponseSchema
from app.models import Competition, CompetitionTeamStats, Country, Team
from app.schemas import CountryBaseSchema, TeamBaseSchema
from app.logger import logger

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
    logger.info("Fetching all Competitions.")
    query = select(
        Competition,
        Country
    ).join(
        Country
    )

    result = await session.execute(query)
    competitions = result.all()

    logger.debug(f"Found {len(competitions)} competitions.")

    return [
        CompetitionResponseSchema(
            **competition.model_dump(), country=CountryBaseSchema(**country.dict()))
        for competition, country in competitions
    ]


@router.get("/{competition_id}",
            response_model=CompetitionResponseSchema)
async def get_competition(
    *,
    session: AsyncSession = Depends(get_session),
    competition_id: str
):
    logger.info(f"Fetching competition with fbref_id={competition_id}")

    query = select(
        Competition,
        Country
    ).join(
        Country
    ).where(
        Competition.fbref_id == competition_id
    )

    result = await session.execute(query)

    competition = result.first()

    if not competition:
        logger.warning(f"Competition with fbref_id={competition_id} not found")
        raise HTTPException(status_code=404, detail="Competition Not found.")

    logger.debug(f"Found competition: {competition[0].name}")

    return CompetitionResponseSchema(
        **competition[0].model_dump(), country=competition[1].model_dump()
    )


@router.get("/{competition_id}/{season}",
            response_model=list[CompetitionDetailDataSchema])
async def get_competition_statistics(
    *,
    session: AsyncSession = Depends(get_session),
    competition_id: str,
    season: str
):
    logger.info(
        f"Fetching stats for competition_id={competition_id} in season={season}"
    )

    competition_query = select(
        CompetitionTeamStats,
        Competition,
        Team
    ).join(
        Team
    ).join(
        Competition
    ).where(
        and_(
            CompetitionTeamStats.season_id == season,
            CompetitionTeamStats.competition_id == competition_id
        )
    )

    result = await session.execute(competition_query)
    data = result.all()

    if not data:
        logger.warning(
            f"No stats found for competition_id={competition_id} in season={season}"
        )
        raise HTTPException(status_code=404, detail="Competition Not found.")

    logger.debug(f"Found {len(data)} stat entries")

    return [
        CompetitionDetailDataSchema(
            **cts.model_dump(),
            competition=CompetitionResponseSchema(**competition.model_dump()),
            team=TeamBaseSchema(**team.model_dump())
        ) for cts, competition, team in data
    ]
