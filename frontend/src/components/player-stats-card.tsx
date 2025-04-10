import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "~/components/ui/card"

type PlayerStatsCardProps = {
  name: string
  team: string
  stat: string
  statLabel: string
  image: string
  index: number
}

export function PlayerStatsCard({
  name,
  team,
  stat,
  statLabel,
  image,
  index
}: PlayerStatsCardProps) {
  return (
    <Card className="overflow-hidden group">
      <CardHeader className="p-0">
        <motion.div
          className="h-2 bg-primary"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: (index || 0) * 0.1 + 0.3, duration: 0.8, ease: "easeOut" }}
        />
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <motion.div
            className="relative h-20 w-20 overflow-hidden rounded-full border"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <img
              src={image || "/placeholder.svg"}
              alt={name}
              className="w-full h-full object-cover" />
          </motion.div>
          <div className="flex-1">
            <motion.h3
              className="text-xl font-bold"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (index || 0) * 0.1 + 0.2 }}
            >
              {name}
            </motion.h3>
            <motion.p
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: (index || 0) * 0.1 + 0.3 }}
            >
              {team}
            </motion.p>
            <motion.div
              className="mt-2 flex items-baseline gap-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (index || 0) * 0.1 + 0.4 }}
            >
              <span className="text-3xl font-bold">{stat}</span>
              <span className="text-sm text-muted-foreground">{statLabel}</span>
            </motion.div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

