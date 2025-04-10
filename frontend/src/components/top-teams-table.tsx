"use client"

import { motion } from "framer-motion"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "~/components/ui/table"

export function TopTeamsTable() {
  const teams = [
    {
      position: 1,
      name: "Manchester City",
      played: 38,
      won: 28,
      drawn: 7,
      lost: 3,
      points: 91,
      form: "WWWDW",
    },
    {
      position: 2,
      name: "Arsenal",
      played: 38,
      won: 27,
      drawn: 6,
      lost: 5,
      points: 87,
      form: "WWWWW",
    },
    {
      position: 3,
      name: "Liverpool",
      played: 38,
      won: 24,
      drawn: 10,
      lost: 4,
      points: 82,
      form: "WDWLW",
    },
    {
      position: 4,
      name: "Aston Villa",
      played: 38,
      won: 22,
      drawn: 7,
      lost: 9,
      points: 73,
      form: "LWWDW",
    },
    {
      position: 5,
      name: "Tottenham",
      played: 38,
      won: 20,
      drawn: 6,
      lost: 12,
      points: 66,
      form: "WLWLW",
    },
  ]

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">#</TableHead>
          <TableHead>Team</TableHead>
          <TableHead className="text-center">P</TableHead>
          <TableHead className="text-center">W</TableHead>
          <TableHead className="text-center">D</TableHead>
          <TableHead className="text-center">L</TableHead>
          <TableHead className="text-center">Pts</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {teams.map((team, index) => (
          <motion.tr
            key={team.position}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: index * 0.1,
              ease: "easeOut",
            }}
            whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
          >
            <TableCell className="font-medium">{team.position}</TableCell>
            <TableCell>{team.name}</TableCell>
            <TableCell className="text-center">{team.played}</TableCell>
            <TableCell className="text-center">{team.won}</TableCell>
            <TableCell className="text-center">{team.drawn}</TableCell>
            <TableCell className="text-center">{team.lost}</TableCell>
            <motion.td
              className="text-center p-4 font-bold"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              {team.points}
            </motion.td>
          </motion.tr>
        ))}
      </TableBody>
    </Table>
  )
}

