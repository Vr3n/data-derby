from app.schemas import (CompetitionBaseSchema, CompetitionTeamStatsBaseSchema,
                         CountryBaseSchema, StatTypeBaseSchema, TeamBaseSchema,)


class CompetitionResponseSchema(CompetitionBaseSchema):
    country: CountryBaseSchema | None = None


class CompetitionDetailDataSchema(CompetitionTeamStatsBaseSchema):
    team: TeamBaseSchema
    competition: CompetitionResponseSchema
    season_id: str
    stat_type_id: str
