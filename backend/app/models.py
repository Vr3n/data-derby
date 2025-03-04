from uuid import UUID, uuid4
from datetime import datetime

from sqlmodel import Field, SQLModel
from sqlalchemy.dialects.postgresql import JSONB


class BaseModelMixin(SQLModel):
    """
    The fields reused in all the model.
    """
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)


class Country(BaseModelMixin, table=True):
    name: str
    abbr: str
    fbref_url: str | None = None


class Competition(BaseModelMixin, table=True):
    name: str
    country_id: UUID | None = Field(foreign_key="country.id", default=None)
    fbref_id: str = Field(index=True, unique=True)
    slug: str
    gender: str | None = None


class Season(SQLModel, table=True):
    year: str = Field(primary_key=True)


class Player(BaseModelMixin, tabel=True):
    name: str
    fbref_id: str = Field(unique=True, index=True)
    based_country_id: UUID = Field(foreign_key="country.id", nullable=True, default=None)
    player_url: str | None = None


class Team(BaseModelMixin, table=True):
    name: str
    fbref_id: str = Field(unique=True, index=True)
    based_country_id: UUID = Field(foreign_key="country.id", nullable=True, default=None)
    team_url: str | None = None


class StatType(BaseModelMixin, table=True):
    name: str = Field(unique=True, index=True)
    description: str | None = None


class CompetitionTeamStats(BaseModelMixin, table=True):
    competition_id: str = Field(foreign_key="competition.fbref_id")
    season_id: str = Field(foreign_key="season.year")
    team_id: str = Field(foreign_key="team.fbref_id")
    stat_type_id: str = Field(foreign_key="stattype.name")

    data: dict = Field(default={}, sa_type=JSONB)
