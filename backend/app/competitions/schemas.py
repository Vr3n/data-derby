from app.schemas import (CompetitionBaseSchema, CountryBaseSchema,)


class CompetitionResponseSchema(CompetitionBaseSchema):
    country: CountryBaseSchema | None = None
