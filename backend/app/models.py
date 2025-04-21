from uuid import UUID, uuid4
from datetime import datetime

from sqlmodel import Field, SQLModel, Relationship

from app.schemas import (
    CompetitionBaseSchema, CompetitionPlayerStatsBaseSchema,
    CompetitionTeamStatsBaseSchema, PlayersBaseSchema,
    StatTypeBaseSchema, TeamBaseSchema,
)


class BaseModelMixin(SQLModel):
    """
    The fields reused in all the model.
    """
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)


class Country(BaseModelMixin, table=True):
    name: str
    abbr: str = Field(unique=True, index=True)
    fbref_url: str | None = None

    competitions: list["Competition"] = Relationship(
        back_populates="competition_country",
        sa_relationship_kwargs={
            "lazy": "selectin"
        }
    )

    players: list["Player"] = Relationship(
        back_populates="player_country",
        sa_relationship_kwargs={
            "lazy": "selectin"
        }
    )

    teams: list["Team"] = Relationship(
        back_populates="team_country",
        sa_relationship_kwargs={
            "lazy": "selectin"
        }
    )


class Competition(CompetitionBaseSchema,
                  BaseModelMixin,
                  table=True):
    country_id: UUID | None = Field(foreign_key="country.id", default=None)

    competition_country: Country | None = Relationship(
        back_populates="competitions",
        sa_relationship_kwargs={
            "lazy": "selectin"
        }
    )


class Season(SQLModel, table=True):
    year: str = Field(primary_key=True)


class Player(PlayersBaseSchema, BaseModelMixin, table=True):
    based_country_id: str = Field(
        foreign_key="country.abbr", nullable=True, default=None)

    player_country: Country | None = Relationship(
        back_populates="players",
        sa_relationship_kwargs={"lazy": "selectin"}
    )


class Team(TeamBaseSchema, BaseModelMixin, table=True):
    based_country_id: UUID | None = Field(
        foreign_key="country.id", nullable=True, default=None)

    team_country: Country | None = Relationship(
        back_populates="teams",
        sa_relationship_kwargs={"lazy": "selectin"}
    )


class StatType(StatTypeBaseSchema, BaseModelMixin, table=True):
    ...


class CompetitionTeamStats(CompetitionTeamStatsBaseSchema, BaseModelMixin, table=True):
    stat_type_id: str = Field(foreign_key="stattype.name", index=True)
    competition_id: str = Field(foreign_key="competition.fbref_id", index=True)
    season_id: str = Field(foreign_key="season.year", index=True)
    team_id: str = Field(foreign_key="team.fbref_id", index=True)


class CompetitionPlayerStats(CompetitionPlayerStatsBaseSchema, BaseModelMixin,
                             table=True):
    competition_id: str = Field(foreign_key="competition.fbref_id", index=True)
    season_id: str = Field(foreign_key="season.year", index=True)
    player_id: str = Field(foreign_key="player.fbref_id", index=True)
    team_id: str = Field(foreign_key="team.fbref_id", index=True)
    stat_type_id: str = Field(foreign_key="stattype.name", index=True)
