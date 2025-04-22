import { motion } from "framer-motion";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { LeagueTable, LeagueTableRow } from "~/components/league-table";
import { TeamStatsOverview } from "~/components/team-stats-overview";
import { StatsGrid } from "~/components/stats-grid";
import { PlayersTab } from "~/components/players-tab";
import { createFileRoute } from "@tanstack/react-router";
import { competitionStatsQueries } from "~/api/competitionStatsQueries";
import { queryClient } from "~/main";
import { formatLeagueName } from "~/lib/utils";
import { StatRecord } from "~/types";

export const Route = createFileRoute("/competitions/$id/")({
  loader: ({ params }) =>
    queryClient.ensureQueryData(
      competitionStatsQueries.bySeason(params.id, "2024-2025")
    ),
  component: RouteComponent,
});

// helper function for mapping league table data from api.
const mapOverallStats = (data: StatRecord[]): LeagueTableRow[] => {
  return data
    .filter((row) => row.stat_type_id === "overall")
    .map(({ data, team }) => ({
      position: parseInt(data.rank),
      team: team.name,
      played: parseInt(data.games),
      won: parseInt(data.wins),
      drawn: parseInt(data.ties),
      lost: parseInt(data.losses),
      goalsFor: parseInt(data.goals_for),
      goalsAgainst: parseInt(data.goals_against),
      goalDifference: parseInt(data.goal_diff.replace("+", "") || "0"),
      points: parseInt(data.points),
      form: data.last_5?.trim().split(/\s+/) ?? [],
      xgFor: parseFloat(data.xg_for),
      xgAgainst: parseFloat(data.xg_against),
      xgDiff: parseFloat(data.xg_diff),
      xgDiffPer90: parseFloat(data.xg_diff_per90),
      pointsAvg: parseFloat(data.points_avg),
      topKeeper: data.top_keeper,
      attendancePerGame: parseFloat(data.attendance_per_g.replace(/,/g, "")),
      notes: data.notes,
    }));
};

function RouteComponent() {
  const data = Route.useLoaderData();

  const leagueTableData = mapOverallStats(data);

  return (
    <>
      <section className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          <img
            src={`${data[0]?.competition.logo_url}`}
            className="h-16 w-16 rounded-full object-fill"
          />
          <div>
            <motion.h2
              className="text-2xl font-bold"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            ></motion.h2>
            <h2 className="text-2xl ">
              {formatLeagueName(data[0]?.competition.name || "")}
            </h2>
            <p className="text-sm text-gray-500">Season {data[0]?.season_id}</p>
          </div>
        </div>
      </section>
      <section className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <LeagueTable leagueData={leagueTableData} />
        </motion.div>

        <Tabs defaultValue="team" className="mt-8">
          <TabsList className="bg-black/30">
            <TabsTrigger
              value="team"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Team
            </TabsTrigger>
            <TabsTrigger
              value="players"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Players
            </TabsTrigger>
          </TabsList>
          <TabsContent value="team" className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <TeamStatsOverview />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <StatsGrid />
            </motion.div>
          </TabsContent>
          <TabsContent value="players">
            <PlayersTab />
          </TabsContent>
        </Tabs>
      </section>
    </>
  );
}
