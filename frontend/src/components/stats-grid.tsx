import { motion } from "framer-motion"
import { ChevronDown, ChevronUp, Minus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { Badge } from "~/components/ui/badge"
import { Link } from "@tanstack/react-router"

export function StatsGrid() {
  const statSections = [
    {
      title: "GAMES WITHOUT LOSING",
      data: [
        { position: 1, team: "Barcelona B", logo: "B", value: 8, trend: "up" },
        { position: 2, team: "Atletico Baleares", logo: "A", value: 7, trend: "up" },
        { position: 3, team: "Tarragona", logo: "T", value: 6, trend: "down" },
        { position: 4, team: "Sabadell", logo: "S", value: 4, trend: "up" },
        { position: 5, team: "Teruel", logo: "T", value: 4, trend: "down" },
      ],
      streakData: [
        { result: "W", count: 3 },
        { result: "W", count: 1 },
        { result: "W", count: 1 },
        { result: "X", count: 1 },
      ],
    },
    {
      title: "GAMES WITHOUT WINNING",
      data: [
        { position: 1, team: "Cornella", logo: "C", value: 8, trend: "up" },
        { position: 2, team: "Atletico Baleares B", logo: "A", value: 7, trend: "up" },
        { position: 3, team: "Lugo", logo: "L", value: 5, trend: "down" },
        { position: 4, team: "Ponferrada", logo: "P", value: 5, trend: "up" },
        { position: 5, team: "Real San Sebastian B", logo: "R", value: 4, trend: "down" },
      ],
    },
    {
      title: "GAMES WITHOUT CONCEDING",
      data: [
        { position: 1, team: "Sabadell", logo: "S", value: 5, trend: "up" },
        { position: 2, team: "Teruel", logo: "T", value: 4, trend: "up" },
        { position: 3, team: "Cornella", logo: "C", value: 3, trend: "down" },
        { position: 4, team: "Atletico Baleares", logo: "A", value: 3, trend: "up" },
        {},
        { position: 4, team: "Atletico Baleares", logo: "A", value: 3, trend: "up" },
        { position: 5, team: "Lugo", logo: "L", value: 2, trend: "down" },
      ],
    },
    {
      title: "RED CARDS",
      data: [
        { position: 1, team: "Tarragona", logo: "T", value: 1, trend: "neutral" },
        { position: 2, team: "Barcelona B", logo: "B", value: 0, trend: "neutral" },
        { position: 3, team: "Sabadell", logo: "S", value: 0, trend: "neutral" },
        { position: 4, team: "Lugo", logo: "L", value: 0, trend: "neutral" },
        { position: 5, team: "Cornella", logo: "C", value: 0, trend: "neutral" },
      ],
      valuePrefix: "",
    },
    {
      title: "NET TRANSFER SPEND",
      data: [
        { position: 1, team: "Barcelona B", logo: "B", value: 0, trend: "neutral" },
        { position: 2, team: "Cornella", logo: "C", value: 0, trend: "neutral" },
        { position: 3, team: "Real San Sebastian B", logo: "R", value: 0, trend: "neutral" },
        { position: 4, team: "Vigo B", logo: "V", value: 0, trend: "neutral" },
        { position: 5, team: "Teruel", logo: "T", value: 0, trend: "neutral" },
      ],
      valuePrefix: "€",
    },
    {
      title: "AVERAGE POSSESSION",
      data: [
        { position: 1, team: "Barcelona B", logo: "B", value: 65, trend: "up" },
        { position: 2, team: "Real San Sebastian B", logo: "R", value: 58, trend: "up" },
        { position: 3, team: "Cornella", logo: "C", value: 54, trend: "down" },
        { position: 4, team: "Sabadell", logo: "S", value: 52, trend: "up" },
        { position: 5, team: "Lugo", logo: "L", value: 51, trend: "down" },
      ],
      valuePrefix: "",
      valueSuffix: "%",
    },
  ]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <ChevronUp className="h-4 w-4 text-green-500" />
      case "down":
        return <ChevronDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-400" />
    }
  }

  const getStreakBadgeColor = (result: string) => {
    switch (result) {
      case "W":
        return "bg-green-500 text-white"
      case "L":
        return "bg-red-500 text-white"
      case "D":
        return "bg-amber-500 text-white"
      case "X":
        return "bg-gray-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {statSections.map((section, sectionIndex) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
        >
          <Card className="bg-white border h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-800">{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="w-10">#</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {section.data.map((item, index) => (
                    <motion.tr
                      key={item.position}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <TableCell className="font-medium">{item.position}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white">
                            {item.logo}
                          </div>
                          <Link className="hover:underline" to="/teams/$name" params={{ name: item.team }}>
                            {item.team}
                          </Link>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <span className="font-bold">
                            {section.valuePrefix || ""}
                            {item.value}
                            {section.valueSuffix || ""}
                          </span>
                          {getTrendIcon(item.trend ?? "")}
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>

              {section.streakData && (
                <div className="p-4 border-t">
                  <div className="flex gap-1">
                    {section.streakData.map((streak, index) => (
                      <div key={index} className="flex items-center">
                        {Array(streak.count)
                          .fill(0)
                          .map((_, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className={`w-6 h-6 p-0 flex items-center justify-center rounded-none first:rounded-l last:rounded-r ${getStreakBadgeColor(streak.result)}`}
                            >
                              {streak.result}
                            </Badge>
                          ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

