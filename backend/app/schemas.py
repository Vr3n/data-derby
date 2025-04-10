from sqlmodel import SQLModel, Field


class CountryBaseSchema(SQLModel):
    name: str
    abbr: str = Field(unique=True, index=True)
    fbref_url: str | None = None


class CompetitionBaseSchema(SQLModel):
    name: str
    country_id: UUID | None = Field(foreign_key="country.id", default=None)
    fbref_id: str = Field(index=True, unique=True)
    slug: str
    gender: str | None = None
    logo_url: str | None = None
