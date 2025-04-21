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
  country: Country;
};
