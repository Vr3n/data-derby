from datetime import datetime
import io
from fastapi.responses import StreamingResponse
import pandas as pd

from collections import defaultdict
from typing import Any, Dict, List
from fastapi import Depends, FastAPI, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import text, select

from app.database import get_session
from app.models import Competition, CompetitionPlayerStats, CompetitionTeamStats, Player, Team

app = FastAPI()


@app.get("/")
def read_root():
    return {"message": "Hello, Friend!"}


@app.get("/{name}")
def read_name(name: str):
    return {"message": f"Hello, {name}!"}


@app.get("/competition/{competition_id}/season/{season_id}/team-stats")
async def get_flattened_team_stats(
    competition_id: str,
    season_id: str,
    session: AsyncSession = Depends(get_session)
) -> List[Dict[str, Any]]:
    """
    Retrieve team statistics for a given competition and season.
    Each JSON key from the 'data' field is pivoted into a column.

    Example output:
    {
        "team_id": "...",
        "team_name": "Arsenal",
        "logo_url": "...",
        "goals": "45",
        "xg": "38.2",
        ...
    }

    Returns:
        List of dictionaries with stat names as dynamic keys.
    """

    sql = text("""
        WITH latest_stats AS (
            SELECT DISTINCT ON (cts.team_id, cts.stat_type_id)
                cts.team_id,
                t.name AS team_name,
                t.logo_url,
                cts.stat_type_id,
                cts.data
            FROM competitionteamstats cts
            JOIN team t ON t.fbref_id = cts.team_id
            WHERE cts.season_id = :season_id
              AND cts.competition_id = :competition_id
            ORDER BY cts.team_id, cts.stat_type_id, cts.created_at DESC
        ),

        expanded_json AS (
            SELECT 
                ls.team_id,
                ls.team_name,
                ls.logo_url,
                kv.key AS stat_name,
                kv.value AS stat_value
            FROM latest_stats ls,
            LATERAL jsonb_each_text(ls.data) AS kv(key, value)
        )

        SELECT
            team_id,
            team_name,
            logo_url,
            stat_name,
            stat_value
        FROM expanded_json
        ORDER BY team_name, stat_name;
    """)

    try:
        result = await session.execute(sql, {"competition_id": competition_id, "season_id": season_id})
        rows = result.fetchall()

        # Pivot the result so each stat_name becomes a column
        team_stats = defaultdict(lambda: {})

        for row in rows:
            team_id = row.team_id
            team_stats[team_id]["team_id"] = team_id
            team_stats[team_id]["team_name"] = row.team_name
            team_stats[team_id]["logo_url"] = row.logo_url
            team_stats[team_id][row.stat_name.lower().replace(" ", "_")
                                ] = row.stat_value

        return list(team_stats.values())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/download/team-competition-stats")
async def download_team_competition_stats_csv(session: AsyncSession = Depends(get_session)):
    query = (
        select(
            CompetitionTeamStats,
            Team,
            Competition
        )
        .join(Team)
        .join(Competition)
    )

    result = await session.execute(query)
    rows = result.all()

    if not rows:
        return {"message": "No data found."}

    merged_rows = defaultdict(dict)

    for cts, team, comp in rows:
        key = (team.fbref_id, cts.season_id)

        if 'team_id' not in merged_rows[key]:
            # Initializing base player data.
            merged_rows[key].update({
                'team_id': team.fbref_id,
                'team_name': team.name,
                'competition_name': comp.name,
            })

        # Updating the dynamic stats.
        merged_rows[key].update(cts.data or {})

    df = pd.DataFrame(merged_rows.values())

    # output to csv.
    buffer = io.StringIO()
    df.to_csv(buffer, index=False)
    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename=team_stats_{datetime.now()}.csv"
        }
    )


@app.get('/download/player-competition-stats')
async def download_player_competition_stats_csv(
    # competition_id: str = Query(
    #     ..., description="Competition fbref_id (e.g. 9 for 'Premier League')"),
    # season: str = Query(..., description="Season Year (e.g, '2024-2025')"),
    session: AsyncSession = Depends(get_session)
):
    query = (
        select(
            CompetitionPlayerStats,
            Player,
            Team,
            Competition
        )
        .join(Player)
        .join(Team)
        .join(Competition)
        # .where(
        #     CompetitionPlayerStats.competition_id == competition_id,
        #     CompetitionPlayerStats.season_id == season
        # )
    )

    result = await session.execute(query)

    rows = result.all()

    if not rows:
        return {"message": "No data found."}

    # TODO: MUltiple Column definitions, multiple places to update.
    # Make a single column variable which reflects the updates.

    df = pd.DataFrame(
        columns=['player_id', 'player_name', 'birth_year',                # type: ignore
                 'team_name', 'competition_name', 'season']
    )

    for cps, player, team, comp in rows:
        player_id = player.fbref_id
        data_dict = cps.data or {}

        if player_id not in df.index:
            # Initializing base player data.
            base_info = {
                'player_id': player.fbref_id,
                'player_name': player.name,
                'team_name': team.name,
                'birth_year': player.birth_year,
                'competition_name': comp.name,
                'season': cps.season_id,
            }

            df.loc[player_id] = base_info

        for k, v in data_dict.items():
            df.loc[player_id, k] = v

    # output to csv.
    buffer = io.StringIO()
    df.to_csv(buffer, index=False)
    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="text/csv",
        headers={
            # "Content-Disposition": f"attachment; filename=player_stats_{competition_id}_{season}_{datetime.now()}.csv"
            "Content-Disposition": f"attachment; filename=player_stats_{datetime.now()}.csv"
        }
    )
