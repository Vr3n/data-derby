import { QueryClient } from "@tanstack/react-query";
import { Team } from "~/types";
import { BASE_URL, handleRepsonse } from "~/fetchClient";

export const teamFetchClient = {
  getteams: async (): Promise<Team[]> => {
    const response = await fetch(`${BASE_URL}/teams/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return handleRepsonse<Team[]>(response);
  },
};

export const teamKeys = {
  all: ["teams"] as const,
  lists: () => [...teamKeys.all, "list"] as const,
  details: () => [...teamKeys.all, "detail"] as const,
  detail: (id: string) => [...teamKeys.details(), id] as const,
};

export const teamQueries = {
  getteams: () => ({
    queryKey: teamKeys.lists(),
    queryFn: () => teamFetchClient.getteams(),
    keepPreviousData: true,
    staleTime: 5000,
  }),
};

export const invalidateTeamQueries = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({
    queryKey: teamKeys.all,
  });
