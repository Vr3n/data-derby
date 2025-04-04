from collections import defaultdict
from typing import Any, Dict, List
from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import text

from app.database import get_session

app = FastAPI()


@app.get("/")
def read_root():
    return { "message": "Hello, Friend!" }


@app.get("/{name}")
def read_name(name: str):
    return { "message": f"Hello, {name}!" }


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
            team_stats[team_id][row.stat_name.lower().replace(" ", "_")] = row.stat_value

        return list(team_stats.values())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
