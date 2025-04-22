import { QueryClient } from "@tanstack/react-query";
import { Competition, StatRecord } from "~/types";
import { BASE_URL, handleRepsonse } from "~/fetchClient";

export const competitionFetchClient = {
  getCompetitions: async (): Promise<Competition[]> => {
    const response = await fetch(`${BASE_URL}/competitions/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return handleRepsonse<Competition[]>(response);
  },
  getCompetition: async (id: string): Promise<Competition> => {
    const response = await fetch(`${BASE_URL}/competitions/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return handleRepsonse<Competition>(response);
  },
};

export const competitionKeys = {
  all: ["competitions"] as const,
  lists: () => [...competitionKeys.all, "list"] as const,
  details: () => [...competitionKeys.all, "detail"] as const,
  detail: (id: string) => [...competitionKeys.details(), id] as const,
};

export const competitionQueries = {
  getCompetitions: () => ({
    queryKey: competitionKeys.lists(),
    queryFn: () => competitionFetchClient.getCompetitions(),
    keepPreviousData: true,
    staleTime: 5000,
  }),
  getCompetition: (id: string) => ({
    queryKey: competitionKeys.detail(id),
    queryFn: () => competitionFetchClient.getCompetition(id),
    keepPreviousData: true,
    staleTime: 5000,
  }),
};

export const invalidateCompetitionQueries = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({
    queryKey: competitionKeys.all,
  });
