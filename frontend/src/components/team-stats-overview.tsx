"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "~/components/ui/card"
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow
} from "~/components/ui/table"
import { Link } from "@tanstack/react-router"

type StatCategory = "goals" | "shots" | "passes" | "tackles" | "cleanSheets"

interface TeamStat {
  id: number
  name: string
  logo: string
  value: string | number
}

export function TeamStatsOverview() {
  const [selectedCategory, setSelectedCategory] = useState<StatCategory>("goals")

  const statCategories = [
    { id: "goals", label: "TEAM GOALS OVERVIEW", leftLabel: "Most Goals", rightLabel: "Fewest Goals" },
    { id: "shots", label: "TEAM SHOTS OVERVIEW", leftLabel: "Most Shots For", rightLabel: "Fewest Shots Against" },
    { id: "passes", label: "TEAM PASSES OVERVIEW", leftLabel: "Best Pass Completion", rightLabel: "Most Possession" },
    { id: "tackles", label: "TEAM TACKLES OVERVIEW", leftLabel: "Most Tackles Won", rightLabel: "Most Dribbles Made" },
    {
      id: "cleanSheets",
      label: "TEAM DEFENSE OVERVIEW",
      leftLabel: "Most Clean Sheets",
      rightLabel: "Fewest Conceded",
    },
  ]

  const statData: Record<StatCategory, { left: TeamStat; right: TeamStat; tableData: TeamStat[] }> = {
    goals: {
      left: { id: 1, name: "Barcelona B", logo: "B", value: "3.00" },
      right: { id: 2, name: "Coruña", logo: "C", value: "32" },
      tableData: [
        { id: 1, name: "Barcelona B", logo: "B", value: 32 },
        { id: 2, name: "Coruña", logo: "C", value: 28 },
        { id: 3, name: "Teruel", logo: "T", value: 24 },
        { id: 4, name: "Sabadell", logo: "S", value: 22 },
        { id: 5, name: "Atletico Baleares", logo: "A", value: 20 },
      ],
    },
    shots: {
      left: { id: 1, name: "Barcelona B", logo: "B", value: "144" },
      right: { id: 2, name: "Barcelona B", logo: "B", value: "40" },
      tableData: [
        { id: 1, name: "Barcelona B", logo: "B", value: 144 },
        { id: 2, name: "Teruel", logo: "T", value: 132 },
        { id: 3, name: "Coruña", logo: "C", value: 128 },
        { id: 4, name: "Sabadell", logo: "S", value: 120 },
        { id: 5, name: "Atletico Baleares", logo: "A", value: 118 },
      ],
    },
    passes: {
      left: { id: 1, name: "Barcelona B", logo: "B", value: "92%" },
      right: { id: 2, name: "Barcelona B", logo: "B", value: "70%" },
      tableData: [
        { id: 1, name: "Barcelona B", logo: "B", value: "92%" },
        { id: 2, name: "Real San Sebastian B", logo: "R", value: "88%" },
        { id: 3, name: "Teruel", logo: "T", value: "85%" },
        { id: 4, name: "Sabadell", logo: "S", value: "82%" },
        { id: 5, name: "Atletico Baleares", logo: "A", value: "80%" },
      ],
    },
    tackles: {
      left: { id: 1, name: "Cornella", logo: "C", value: "171" },
      right: { id: 2, name: "Coruña", logo: "C", value: "152" },
      tableData: [
        { id: 1, name: "Cornella", logo: "C", value: 171 },
        { id: 2, name: "Coruña", logo: "C", value: 152 },
        { id: 3, name: "Barcelona B", logo: "B", value: 145 },
        { id: 4, name: "Teruel", logo: "T", value: 140 },
        { id: 5, name: "Sabadell", logo: "S", value: 138 },
      ],
    },
    cleanSheets: {
      left: { id: 1, name: "Barcelona B", logo: "B", value: "6" },
      right: { id: 2, name: "Barcelona B", logo: "B", value: "2" },
      tableData: [
        { id: 1, name: "Barcelona B", logo: "B", value: 6 },
        { id: 2, name: "Sabadell", logo: "S", value: 5 },
        { id: 3, name: "Teruel", logo: "T", value: 4 },
        { id: 4, name: "Atletico Baleares", logo: "A", value: 3 },
        { id: 5, name: "Cornella", logo: "C", value: 3 },
      ],
    },
  }

  const currentCategory = statCategories.find((cat) => cat.id === selectedCategory) || statCategories[0]
  const currentData = statData[selectedCategory]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2 bg-white border rounded-md p-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4">{currentCategory?.label}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {Object.keys(statData).map((category) => (
            <motion.div
              key={category}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCategory(category as StatCategory)}
              className={`cursor-pointer rounded-full overflow-hidden flex items-center justify-between px-4 py-3 ${selectedCategory === category
                ? "bg-blue-500 text-white ring-2 ring-blue-200"
                : "bg-gray-100 text-gray-800 border"
                }`}
            >
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white">
                  {statData[category as StatCategory].left.logo}
                </div>
                <div>
                  <div className={`text-xs ${selectedCategory === category ? "text-blue-100" : "text-blue-500"}`}>
                    {statCategories.find((cat) => cat.id === category)?.leftLabel}
                  </div>
                  <div className="text-sm font-medium hover:underline">
                    <Link
                      to="/teams/$name"
                      params={{
                        name: statData[category as StatCategory].left.name
                      }}
                    >
                      {statData[category as StatCategory].left.name}
                    </Link>
                  </div>
                </div>
              </div>
              <div className="text-xl font-bold">{statData[category as StatCategory].left.value}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white border rounded-md overflow-hidden"
        >
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Team</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.tableData.map((team, index) => (
                <motion.tr
                  key={team.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 hover:underline">
                      <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white">
                        {team.logo}
                      </div>
                      <Link to="/teams/$name" params={{
                        name: team.name
                      }}>
                        {team.name}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-bold">{team.value}</TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      </div>

      <Card className="bg-white border">
        <CardContent className="p-4">
          <h3 className="text-lg font-bold mb-4 text-gray-800">TEAM COMPARISON</h3>

          <div className="space-y-4">
            {Object.keys(statData).map((category) => {
              const data = statData[category as StatCategory]
              const catInfo = statCategories.find((cat) => cat.id === category)

              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between text-xs text-blue-500">
                    <span>{catInfo?.leftLabel}</span>
                    <span>{catInfo?.rightLabel}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white">
                        {data.left.logo}
                      </div>
                      <span className="text-sm">{data.left.value}</span>
                    </div>

                    <div className="flex-1 h-1 bg-gray-200 rounded-full">
                      <motion.div
                        className="h-full bg-blue-500 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: "50%" }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-sm">{data.right.value}</span>
                      <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white">
                        {data.right.logo}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

