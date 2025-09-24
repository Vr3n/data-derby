from pydantic import field_validator
from backend.app.pipeline.fbref_schemas import ResultOverallBaseSchema


class ResultsOverallValidator(ResultOverallBaseSchema):
    @field_validator(
        "rank", "games", "wins", "ties", "losses",
        "goals_for", "goals_against", "points",
        mode="after"
    )
    @classmethod
    def validate_nonnegatives(cls, v):
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

    @field_validator("", mode="after")
    @classmethod
    def _validate_consistency(cls, values):
        # cross-field checks
        games = values.get("games")
        wins = values.get("wins")
        ties = values.get("ties")
        losses = values.get("losses")
        gf = values.get("goals_for")
        ga = values.get("goals_against")
        gd = values.get("goal_diff")

        if games is not None and wins is not None and ties is not None and losses is not None:
            if wins + ties + losses != games:
                raise ValueError(f"W+T+L {wins}+{ties}+{losses} != {games}")

        if gf is not None and ga is not None and gd is not None:
            if gf - ga != gd:
                raise ValueError(f"goal_diff inconsistency: {gf} - {ga} != {gd}")

        return values
