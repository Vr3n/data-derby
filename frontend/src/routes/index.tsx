import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { competitionQueries } from "~/api/competitionQueries";
import { teamQueries } from "~/api/teamQueries";
import { AnimatedCard } from "~/components/animated-card";
import { CompetitionCard } from "~/components/competition-card";
import { TeamCard } from "~/components/team-card";
import { queryClient } from "~/main";

export const Route = createFileRoute("/")({
  loader: async () => {
    const competitionPromise = queryClient.ensureQueryData(
      competitionQueries.getCompetitions()
    );
    const teamPromise = queryClient.ensureQueryData(teamQueries.getteams());

    const [competitions, teams] = await Promise.all([
      competitionPromise,
      teamPromise,
    ]);

    return { competitions, teams };
  },
  component: HomeComponent,
});

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

function HomeComponent() {
  const data = Route.useLoaderData();

  return (
    <>
      <section className="mb-16">
        <motion.h2
          className="text-3xl font-bold mb-8"
          initial={{ opacity: 0, y: -2 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Competitions
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {data.competitions.map((competition, idx) => (
            <AnimatedCard
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 1 }}
              transition={{ duration: 0.2 }}
              className="shadow-md rounded-2xl hover:shadow-lg"
            >
              <CompetitionCard
                key={competition.fbref_id}
                fbref_id={competition.fbref_id}
                name={competition.name}
                image={competition.logo_url || ""}
                country={competition.country?.name || ""}
              />
            </AnimatedCard>
          ))}
        </motion.div>
      </section>
      <section className="mb-16">
        <motion.h2
          className="text-3xl font-bold mb-8"
          initial={{ opacity: 0, y: -2 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Teams
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {data.teams.map((team, idx) => (
            <AnimatedCard
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 1 }}
              transition={{
                duration: 0.2,
              }}
              className="shadow-md rounded-2xl hover:shadow-lg"
            >
              <TeamCard
                key={team.fbref_id}
                index={idx}
                name={team.name}
                image={team.logo_url || ""}
              />
            </AnimatedCard>
          ))}
        </motion.div>
      </section>
    </>
  );
}
