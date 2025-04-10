import { motion } from "framer-motion"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { LeagueTable } from "~/components/league-table"
import { TeamStatsOverview } from "~/components/team-stats-overview"
import { StatsGrid } from "~/components/stats-grid"
import { PlayersTab } from "~/components/players-tab"
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/competitions/$name/')({
  component: RouteComponent,
})

function RouteComponent() {

  const { name } = Route.useParams()

  return (
    <div>
      <section className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          <img className="h-16 w-16 rounded-full object-cover" />
          <div>
            <motion.h2
              className="text-2xl font-bold"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {name}
            </motion.h2>
            <p className="text-sm text-gray-500">Season 2024-2025</p>
            <p className="text-xs text-gray-400">Spanish Regional</p>
          </div>
        </div>
      </section>
      <section className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <LeagueTable />
        </motion.div>

        <Tabs defaultValue="team" className="mt-8">
          <TabsList className="bg-black/30">
            <TabsTrigger value="team" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Team
            </TabsTrigger>
            <TabsTrigger value="players" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
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
    </div>
  )
}
