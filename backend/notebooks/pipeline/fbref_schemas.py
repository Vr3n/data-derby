from pydantic import BaseModel, StrictInt


class ResultOverallBaseSchema(BaseModel):
    id: str
    competition_id: str
    season_id: str

    rank: StrictInt
    team_id: str
    team_url: str
    team: str
    logo_url: str | None

    games: StrictInt
    wins: StrictInt
    ties: StrictInt
    losses: StrictInt
    goals_for: StrictInt
    goals_against: StrictInt
    goal_diff: int
    points: StrictInt
    points_avg: float
    xg_for: float
    xg_against: float
    xg_diff: float
    xg_diff_per90: float

    last_5: str
    attendance_per_g: StrictInt | None
    top_team_scorers: str | None
    top_keeper: str | None
    notes: str | None

    model_config = {"extra": "forbid"}
