import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AnimatedCard } from "~/components/animated-card";
import { CompetitionCard } from "~/components/competition-card";
import { TeamCard } from "~/components/team-card";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

const competitions = [
  { id: 1, name: "Premier League", country: "England", image: "https://picsum.photos/seed/picsum/500/300" },
  { id: 2, name: "La Liga", country: "Spain", image: "https://picsum.photos/seed/picsum/500/300" },
  { id: 3, name: "Bundesliga", country: "Germany", image: "https://picsum.photos/seed/picsum/500/300" },
  { id: 4, name: "Serie A", country: "Italy", image: "https://picsum.photos/seed/picsum/500/300" },
  { id: 5, name: "Ligue 1", country: "France", image: "https://picsum.photos/seed/picsum/500/300" },
]

// Sample data for teams
const teams = [
  {
    id: 1,
    name: "Manchester City",
    league: "Premier League",
    image: "https://picsum.photos/seed/picsum/500/300"
  },
  {
    id: 2,
    name: "Real Madrid",
    league: "La Liga",
    image: "https://picsum.photos/seed/picsum/500/300"
  },
  {
    id: 3,
    name: "Bayern Munich",
    league: "Bundesliga",
    image: "https://picsum.photos/seed/picsum/500/300"
  },
  {
    id: 4,
    name: "Inter Milan",
    league: "Serie A",
    image: "https://picsum.photos/seed/picsum/500/300"
  },
  {
    id: 5,
    name: "PSG",
    league: "Ligue 1",
    image: "https://picsum.photos/seed/picsum/500/300"
  },
  {
    id: 6,
    name: "Ajax",
    league: "Eredivisie",
    image: "https://picsum.photos/seed/picsum/500/300"
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    }
  }
}

function HomeComponent() {

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
          {competitions.map((competition, idx) => (
            <AnimatedCard
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 1 }}
              transition={{ duration: 0.2 }}
              className="shadow-md rounded-2xl hover:shadow-lg"
            >
              <CompetitionCard
                key={competition.id}
                index={idx}
                name={competition.name}
                image={competition.image}
                country={competition.country}
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
          {teams.map((team, idx) => (
            <AnimatedCard
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 1 }}
              transition={{
                duration: 0.2,
              }}
              className="shadow-md rounded-2xl hover:shadow-lg"
            >
              <TeamCard
                key={team.id}
                index={idx}
                name={team.name}
                image={team.image}
              />
            </AnimatedCard>
          ))}
        </motion.div>
      </section>
    </>
  );
}
