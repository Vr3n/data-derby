
from app.schemas import CompetitionTeamStatsBaseSchema, TeamBaseSchema


class TeamResponseSchema(TeamBaseSchema):
    ...


class TeamDetailDataSchema(CompetitionTeamStatsBaseSchema):
    team: TeamBaseSchema
    season_id: str
    stat_type_id: str
