# Base schema with only types (no coercion or validation logic)
from typing import ClassVar
import uuid
from pydantic import BaseModel, ConfigDict, field_validator, model_validator


def parse_int_positive(v: str | int) -> int:
    s = str(v).replace(",", "").strip().lstrip("+")
    iv = int(s)
    if iv < 0:
        raise ValueError("must be non-negative")
    return iv


def parse_int_signed(v: str | int) -> int:
    s = str(v).replace(",", "").strip()
    return int(s)


def parse_float_signed(v: str | float) -> float:
    s = str(v).replace(",", "").strip()
    if s.startswith("+"):
        s = s[1:]
    return float(s)


def parse_last5(v: str) -> str:
    return " ".join([x for x in v])


class ResultsOverallSchema(BaseModel):
    id: str
    competition_id: int
    season_id: str

    rank: int
    team_id: str
    team_url: str
    team: str
    logo_url: str | None

    games: int
    wins: int
    ties: int
    losses: int
    goals_for: int
    goals_against: int
    goal_diff: int
    points: int
    points_avg: float
    xg_for: float
    xg_against: float
    xg_diff: float
    xg_diff_per90: float

    last_5: str
    attendance_per_g: int | None
    top_team_scorers: str | None
    top_keeper: str | None
    notes: str | None

    model_config: ClassVar = ConfigDict(extra="forbid")

    @field_validator("id", mode="before")
    @classmethod
    def _fill_id(cls, v):
        if not v or v == "":
            return str(uuid.uuid4())
        return v

    @field_validator(
        "rank",
        "games",
        "wins",
        "ties",
        "losses",
        "goals_for",
        "goals_against",
        "points",
        "attendance_per_g",
        mode="before",
    )
    @classmethod
    def _coerce_positive_ints(cls, v):
        if v is None or v == "":
            return v
        return parse_int_positive(v)

    @field_validator("goal_diff", mode="before")
    @classmethod
    def _coerce_goal_diff(cls, v):
        return parse_int_signed(v)

    @field_validator(
        "points_avg", "xg_for", "xg_against", "xg_diff", "xg_diff_per90", mode="before"
    )
    @classmethod
    def _coerce_floats(cls, v):
        return parse_float_signed(v)

    @field_validator("last_5", mode="before")
    @classmethod
    def _coerce_last5(cls, v):
        if v is None:
            return v
        return parse_last5(v)

    @field_validator(
        "rank",
        "games",
        "wins",
        "ties",
        "losses",
        "goals_for",
        "goals_against",
        "points",
        mode="after",
    )
    @classmethod
    def _validate_nonnegatives(cls, v):
        if v < 0:
            raise ValueError("must be non-negative")
        return v

    @field_validator("games", mode="after")
    @classmethod
    def _validate_games_positive(cls, v):
        if v <= 0:
            raise ValueError("games must be positive")
        return v

    @field_validator("last_5", mode="after")
    @classmethod
    def _validate_last5_format(cls, v):
        tokens = v.split()
        if len(tokens) != 5:
            raise ValueError(f"last_5 must have 5 tokens, got {v}")
        for t in tokens:
            if t not in {"W", "D", "L"}:
                raise ValueError(f"Invalid result token: {t}")
        return v

    @field_validator("attendance_per_g", mode="after")
    @classmethod
    def _validate_attendance(cls, v):
        if v is not None and v < 0:
            raise ValueError("attendance must be non-negative")
        return v

    @model_validator(mode="after")
    def _validate_consistency(self):
        # cross-field checks
        games = self.games
        wins = self.wins
        ties = self.ties
        losses = self.losses
        gf = self.goals_for
        ga = self.goals_against
        gd = self.goal_diff

        if (
            games is not None
            and wins is not None
            and ties is not None
            and losses is not None
        ):
            if wins + ties + losses != games:
                raise ValueError(f"W+T+L {wins}+{ties}+{losses} != {games}")

        if gf is not None and ga is not None and gd is not None:
            if gf - ga != gd:
                raise ValueError(f"goal_diff inconsistency: {gf} - {ga} != {gd}")

        return self
