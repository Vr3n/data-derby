import { motion } from "framer-motion"
import { Card, CardContent } from "~/components/ui/card"

export function PlayerStatsOverview() {
  const playerStats = [
    {
      category: "Most Goals",
      leftPlayer: {
        name: "Guillem Naranjo",
        team: "Sabadell",
        value: "10",
        image: "/placeholder.svg?height=40&width=40",
      },
      rightPlayer: {
        name: "Daniel Luna",
        team: "Coruña",
        value: "8",
        image: "/placeholder.svg?height=40&width=40"
      },
    },
    {
      category: "Most Shots",
      leftPlayer: {
        name: "Alex Collado",
        team: "Barcelona B",
        value: "43",
        image: "/placeholder.svg?height=40&width=40",
      },
      rightPlayer: {
        name: "2 Players",
        team: "",
        value: "4",
        image: "/placeholder.svg?height=40&width=40"
      },
    },
    {
      category: "Most Key Passes",
      leftPlayer: {
        name: "Alex Collado",
        team: "Barcelona B",
        value: "53",
        image: "/placeholder.svg?height=40&width=40",
      },
      rightPlayer: {
        name: "Ander Astrálaga",
        team: "Barcelona B",
        value: "99%",
        image: "/placeholder.svg?height=40&width=40",
      },
      rightLabel: "Best Pass Completion",
    },
    {
      category: "Most Tackles Won",
      leftPlayer: {
        name: "Adrián León",
        team: "Cornella",
        value: "48",
        image: "/placeholder.svg?height=40&width=40"
      },
      rightPlayer: {
        name: "Issa Fomba",
        team: "Sabadell",
        value: "59",
        image: "/placeholder.svg?height=40&width=40"
      },
      rightLabel: "Most Dribbles Made",
    },
    {
      category: "Most Clean Sheets",
      leftPlayer: { name: "2 Players", team: "", value: "7", image: "/placeholder.svg?height=40&width=40" },
      rightPlayer: {
        name: "Pablo Valencia",
        team: "Tarragona",
        value: "6",
        image: "/placeholder.svg?height=40&width=40",
      },
      rightLabel: "Most Saves",
    },
  ]

  return (
    <Card className="bg-white border mb-6">
      <CardContent className="p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">PLAYER STATS OVERVIEW</h2>

        <div className="space-y-4">
          {playerStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex gap-4"
            >
              {/* Left stat */}
              <motion.div
                className="flex-1 rounded-full overflow-hidden flex items-center justify-between px-4 py-3 bg-gray-100 border"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-2xl font-bold text-gray-800">{stat.leftPlayer.value}</div>
                <div className="flex flex-col items-end">
                  <div className="text-xs text-blue-500 mb-1">{stat.category}</div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium text-gray-700">{stat.leftPlayer.name}</div>
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      <img
                        src={stat.leftPlayer.image || "/placeholder.svg"}
                        alt={stat.leftPlayer.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right stat */}
              <motion.div
                className="flex-1 rounded-full overflow-hidden flex items-center justify-between px-4 py-3 bg-gray-100 border"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex flex-col">
                  <div className="text-xs text-blue-500 mb-1">
                    {stat.rightLabel || `Most ${stat.category.split(" ")[1]}`}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      <img
                        src={stat.rightPlayer.image || "/placeholder.svg"}
                        alt={stat.rightPlayer.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-sm font-medium text-gray-700">{stat.rightPlayer.name}</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-800">{stat.rightPlayer.value}</div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

