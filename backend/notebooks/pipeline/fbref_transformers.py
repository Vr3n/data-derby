import uuid
from pydantic import BaseModel, StrictInt, field_validator

from backend.app.pipeline.fbref_schemas import ResultOverallBaseSchema


def clean_int_positive(value: str | int) -> int:
    if isinstance(value, int):
        v = value
    else:
        s = value.replace(",", "").strip()
        s = s.lstrip("+")
        v = int(s)
    if v < 0:
        raise ValueError(f"Expected non-negative integer, got {v}")
    return v


def clean_int_signed(value: str | int) -> int:
    if isinstance(value, int):
        return value
    s = value.replace(",", "").strip()
    return int(s)


def clean_float_signed(value: str | float) -> float:
    if isinstance(value, float):
        return value
    s = str(value).replace(",", "").strip()
    s = s.lstrip("+") if s.startswith("+") else s
    return float(s)


def clean_last5(value: str) -> str:
    # Expecting "W W L D W" etc, exactly 5 tokens.
    tokens = value.split()
    if len(tokens) != 5:
        raise ValueError(f"Last 5 must have exactly 5 results, got {value}")

    for t in tokens:
        if t not in {"W", "D", "L"}:
            raise ValueError(f"Invalid Token in last 5: {t}")
    return " ".join(tokens)


class ResultOverallTransformClean(ResultOverallBaseSchema):
    @field_validator(
        "id", mode="before"
    )
    @classmethod
    def _fill_id(cls, v):
        if not v or v == "":
            return str(uuid.uuid4())
        return v

    @field_validator(
        "rank", "games", "wins", "ties", "losses",
        "goals_for", "goals_against", "points",
        "attendance_per_g",
        mode="before"
    )
    @classmethod
    def _coerce_positive_ints(cls, v):
        if v is None or v == "":
            return v
        return clean_int_positive(v)

    @field_validator("goal_diff", mode="before")
    @classmethod
    def _coerce_goal_diff(cls, v):
        return clean_int_signed(v)

    @field_validator(
        "points_avg", "xg_for", "xg_against",
        "xg_diff", "xg_diff_per90", mode="before"
    )
    @classmethod
    def _coerce_floats(cls, v):
        return clean_float_signed(v)

    @field_validator("last_5", mode="before")
    @classmethod
    def _coerce_last5(cls, v):
        if v is None:
            return v
        return clean_last5(v)
