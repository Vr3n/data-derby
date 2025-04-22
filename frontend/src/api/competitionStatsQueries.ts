import { BASE_URL, handleRepsonse } from "~/fetchClient";
import { StatRecord } from "~/types";

export const competitionStatsFetchClient = {
  getStatsByCompetitionAndSeason: async (
    competitionId: string,
    season: string
  ): Promise<StatRecord[]> => {
    const res = await fetch(
      `${BASE_URL}/competitions/${competitionId}/${season}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return handleRepsonse<StatRecord[]>(res);
  },
};

export const competitionStatsKeys = {
  all: ["competitionStats"] as const,
  bySeason: (competitionId: string, season: string) =>
    [...competitionStatsKeys.all, competitionId, season] as const,
};

export const competitionStatsQueries = {
  bySeason: (competitionId: string, season: string) => ({
    queryKey: competitionStatsKeys.bySeason(competitionId, season),
    queryFn: () =>
      competitionStatsFetchClient.getStatsByCompetitionAndSeason(
        competitionId,
        season
      ),
    staleTime: 60 * 1000,
    keepPreviousData: true,
  }),
};
