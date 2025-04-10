import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { Badge } from "~/components/ui/badge"
import { Link } from "@tanstack/react-router"

// Sample data for the league table
const leagueData = [
  {
    position: 1,
    team: "Barcelona B",
    played: 8,
    won: 6,
    drawn: 2,
    lost: 0,
    goalsFor: 18,
    goalsAgainst: 6,
    goalDifference: 12,
    points: 20,
    form: ["W", "W", "W", "D", "W"],
  },
  {
    position: 2,
    team: "Teruel",
    played: 8,
    won: 5,
    drawn: 2,
    lost: 1,
    goalsFor: 14,
    goalsAgainst: 7,
    goalDifference: 7,
    points: 17,
    form: ["W", "L", "W", "W", "D"],
  },
  {
    position: 3,
    team: "Sabadell",
    played: 8,
    won: 5,
    drawn: 1,
    lost: 2,
    goalsFor: 12,
    goalsAgainst: 8,
    goalDifference: 4,
    points: 16,
    form: ["L", "W", "W", "W", "D"],
  },
  {
    position: 4,
    team: "Atletico Baleares",
    played: 8,
    won: 4,
    drawn: 3,
    lost: 1,
    goalsFor: 12,
    goalsAgainst: 7,
    goalDifference: 5,
    points: 15,
    form: ["D", "W", "W", "D", "W"],
  },
  {
    position: 5,
    team: "Ponferrada",
    played: 8,
    won: 4,
    drawn: 2,
    lost: 2,
    goalsFor: 11,
    goalsAgainst: 8,
    goalDifference: 3,
    points: 14,
    form: ["W", "L", "D", "W", "W"],
  },
  {
    position: 6,
    team: "Tarragona",
    played: 8,
    won: 4,
    drawn: 2,
    lost: 2,
    goalsFor: 10,
    goalsAgainst: 8,
    goalDifference: 2,
    points: 14,
    form: ["D", "W", "L", "W", "W"],
  },
  {
    position: 7,
    team: "Cornella",
    played: 8,
    won: 3,
    drawn: 4,
    lost: 1,
    goalsFor: 11,
    goalsAgainst: 9,
    goalDifference: 2,
    points: 13,
    form: ["D", "D", "W", "D", "D"],
  },
  {
    position: 8,
    team: "Lugo",
    played: 8,
    won: 3,
    drawn: 3,
    lost: 2,
    goalsFor: 10,
    goalsAgainst: 9,
    goalDifference: 1,
    points: 12,
    form: ["W", "D", "L", "W", "D"],
  },
  {
    position: 9,
    team: "Real Irun",
    played: 8,
    won: 3,
    drawn: 2,
    lost: 3,
    goalsFor: 10,
    goalsAgainst: 10,
    goalDifference: 0,
    points: 11,
    form: ["L", "W", "D", "W", "L"],
  },
  {
    position: 10,
    team: "Real San Sebastian B",
    played: 8,
    won: 3,
    drawn: 1,
    lost: 4,
    goalsFor: 9,
    goalsAgainst: 10,
    goalDifference: -1,
    points: 10,
    form: ["W", "L", "L", "W", "L"],
  },
]

export function LeagueTable() {
  const [sortColumn, setSortColumn] = useState("position")
  const [sortDirection, setSortDirection] = useState("asc")

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const sortedData = [...leagueData].sort((a, b) => {
    const aValue = a[sortColumn as keyof typeof a]
    const bValue = b[sortColumn as keyof typeof b]

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    return 0
  })

  const getFormBadgeColor = (result: string) => {
    switch (result) {
      case "W":
        return "bg-green-500 text-white"
      case "D":
        return "bg-amber-500 text-white"
      case "L":
        return "bg-red-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const SortIcon = ({ column }: { column: string }) => {
    if (sortColumn !== column) return null
    return sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
  }

  return (
    <div className="overflow-x-auto rounded-md border bg-white">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-12 cursor-pointer" onClick={() => handleSort("position")}>
              <div className="flex items-center">
                # <SortIcon column="position" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("team")}>
              <div className="flex items-center">
                Team <SortIcon column="team" />
              </div>
            </TableHead>
            <TableHead className="text-center cursor-pointer" onClick={() => handleSort("played")}>
              <div className="flex items-center justify-center">
                P <SortIcon column="played" />
              </div>
            </TableHead>
            <TableHead className="text-center cursor-pointer" onClick={() => handleSort("won")}>
              <div className="flex items-center justify-center">
                W <SortIcon column="won" />
              </div>
            </TableHead>
            <TableHead className="text-center cursor-pointer" onClick={() => handleSort("drawn")}>
              <div className="flex items-center justify-center">
                D <SortIcon column="drawn" />
              </div>
            </TableHead>
            <TableHead className="text-center cursor-pointer" onClick={() => handleSort("lost")}>
              <div className="flex items-center justify-center">
                L <SortIcon column="lost" />
              </div>
            </TableHead>
            <TableHead className="text-center cursor-pointer" onClick={() => handleSort("goalsFor")}>
              <div className="flex items-center justify-center">
                GF <SortIcon column="goalsFor" />
              </div>
            </TableHead>
            <TableHead className="text-center cursor-pointer" onClick={() => handleSort("goalsAgainst")}>
              <div className="flex items-center justify-center">
                GA <SortIcon column="goalsAgainst" />
              </div>
            </TableHead>
            <TableHead className="text-center cursor-pointer" onClick={() => handleSort("goalDifference")}>
              <div className="flex items-center justify-center">
                GD <SortIcon column="goalDifference" />
              </div>
            </TableHead>
            <TableHead className="text-center cursor-pointer" onClick={() => handleSort("points")}>
              <div className="flex items-center justify-center">
                PTS <SortIcon column="points" />
              </div>
            </TableHead>
            <TableHead className="text-center">Form</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((team, index) => (
            <motion.tr
              key={team.position}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <TableCell className="font-medium">{team.position}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white">
                    {team.team.charAt(0)}
                  </div>
                  <Link className="hover:underline" to="/teams/$name" params={{ name: team.team }}>{team.team}</Link>
                </div>
              </TableCell>
              <TableCell className="text-center">{team.played}</TableCell>
              <TableCell className="text-center">{team.won}</TableCell>
              <TableCell className="text-center">{team.drawn}</TableCell>
              <TableCell className="text-center">{team.lost}</TableCell>
              <TableCell className="text-center">{team.goalsFor}</TableCell>
              <TableCell className="text-center">{team.goalsAgainst}</TableCell>
              <TableCell className="text-center">{team.goalDifference}</TableCell>
              <TableCell className="text-center font-bold">{team.points}</TableCell>
              <TableCell>
                <div className="flex gap-1 justify-center">
                  {team.form.map((result, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className={`w-6 h-6 p-0 flex items-center justify-center ${getFormBadgeColor(result)}`}
                    >
                      {result}
                    </Badge>
                  ))}
                </div>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

