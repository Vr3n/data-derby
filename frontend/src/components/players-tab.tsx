import { motion } from "framer-motion"
import { PlayerStatsOverview } from "~/components/player-stats-overview"
import { PlayerLeaderboard } from "~/components/player-leaderboard"
import { StatsSections } from "~/components/stats-sections"

export const PlayersTab = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      <PlayerStatsOverview />
      <PlayerLeaderboard />
      <StatsSections />
    </motion.div>
  )
}

