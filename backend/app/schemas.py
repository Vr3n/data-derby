from uuid import UUID
from sqlmodel import SQLModel, Field
from sqlalchemy.dialects.postgresql import JSONB


class CountryBaseSchema(SQLModel):
    name: str
    abbr: str = Field(unique=True, index=True)
    fbref_url: str | None = None


class CompetitionBaseSchema(SQLModel):
    name: str
    fbref_id: str = Field(index=True, unique=True)
    slug: str
    gender: str | None = None
    logo_url: str | None = None


class PlayersBaseSchema(SQLModel):
    name: str = Field()
    fbref_id: str = Field(unique=True, index=True)
    birth_year: str | None = None
    player_url: str | None = None
    avatar_url: str | None = None


class TeamBaseSchema(SQLModel):
    name: str
    fbref_id: str = Field(unique=True, index=True)
    team_url: str | None = None
    logo_url: str | None = None


class StatTypeBaseSchema(SQLModel):
    name: str = Field(unique=True, index=True)
    description: str | None = None


class CompetitionTeamStatsBaseSchema(SQLModel):
    data: dict = Field(default={}, sa_type=JSONB)


class CompetitionPlayerStatsBaseSchema(SQLModel):
    matches: str = Field(nullable=True, default=None)
    data: dict = Field(default={}, sa_type=JSONB)