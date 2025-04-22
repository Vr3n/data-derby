export type Team = {
  name: string;
  fbref_id: string;
  team_url: string;
  logo_url: string | null;
};

export type Country = {
  name: string;
  abbr: string;
  fbref_url: string;
};

export type Competition = {
  name: string;
  fbref_id: string;
  slug: string;
  gender: string | null;
  logo_url: string | null;
  country: Country | null;
};

export type StatRecord = {
  data: Record<string, any>;
  team: Team;
  competition: Competition;
  season_id: string;
  stat_type_id: string;
};

export type TeamStatRecord = {
  data: Record<string, any>;
  team: Team;
  season_id: string;
  stat_type_id: string;
};
