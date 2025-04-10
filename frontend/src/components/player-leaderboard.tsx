import { motion } from "framer-motion"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "~/components/ui/table"

export function PlayerLeaderboard() {
  const players = [
    {
      position: "1st",
      name: "Guillem Naranjo",
      team: "Sabadell",
      nationality: "ESP",
      flag: "🇪🇸",
      age: 23,
      goals: 10,
      apps: 12,
      minsPerGoal: "107.90",
      shots: 22,
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      position: "2nd",
      name: "Yuri",
      team: "Ponferrada",
      nationality: "BRA",
      flag: "🇧🇷",
      age: 41,
      goals: 9,
      apps: 9,
      minsPerGoal: "86.33",
      shots: 18,
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      position: "=",
      name: "Alex Collado",
      team: "Barcelona B",
      nationality: "ESP",
      flag: "🇪🇸",
      age: 24,
      goals: 9,
      apps: 12,
      minsPerGoal: "110.00",
      shots: 23,
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      position: "4th",
      name: "Juan Delgado",
      team: "Arenteiro",
      nationality: "ESP",
      flag: "🇪🇸",
      age: 29,
      goals: 7,
      apps: 12,
      minsPerGoal: "134.43",
      shots: 15,
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      position: "=",
      name: "Leandro Martínez",
      team: "Sestao",
      nationality: "ESP",
      flag: "🇪🇸",
      age: 29,
      goals: 7,
      apps: 12,
      minsPerGoal: "147.86",
      shots: 10,
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      position: "6th",
      name: "Kuki Zalazar",
      team: "Coruña",
      nationality: "ESP",
      flag: "🇪🇸",
      age: 25,
      goals: 6,
      apps: "2 (4)",
      minsPerGoal: "45.33",
      shots: 7,
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      position: "=",
      name: "Mohamed-Ali Cho",
      team: "Real San Sebastian B",
      nationality: "FRA",
      flag: "🇫🇷",
      age: 19,
      goals: 6,
      apps: 6,
      minsPerGoal: "90.00",
      shots: 10,
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      position: "=",
      name: "Antón Escobar",
      team: "Real Irun",
      nationality: "ESP",
      flag: "🇪🇸",
      age: 24,
      goals: 6,
      apps: "11 (1)",
      minsPerGoal: "166.17",
      shots: 14,
      image: "/placeholder.svg?height=40&width=40",
    },
  ]

  return (
    <div className="bg-white border rounded-md overflow-hidden mb-6">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800">GOALS</h2>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-16"></TableHead>
              <TableHead>PLAYER</TableHead>
              <TableHead className="text-center">NAT</TableHead>
              <TableHead className="text-center">AGE</TableHead>
              <TableHead className="text-center">GOALS</TableHead>
              <TableHead className="text-center">APPS</TableHead>
              <TableHead className="text-center">MINS/GL</TableHead>
              <TableHead className="text-center">SHT</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map((player, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <TableCell className="font-medium">{player.position}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      <img
                        src={player.image || "/placeholder.svg"}
                        alt={player.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{player.name}</div>
                      <div className="text-xs text-gray-500">{player.team}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <span className="inline-flex items-center">
                    <span className="mr-1">{player.flag}</span>
                    <span>{player.nationality}</span>
                  </span>
                </TableCell>
                <TableCell className="text-center">{player.age}</TableCell>
                <TableCell className="text-center font-bold">{player.goals}</TableCell>
                <TableCell className="text-center">{player.apps}</TableCell>
                <TableCell className="text-center">{player.minsPerGoal}</TableCell>
                <TableCell className="text-center">{player.shots}</TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

