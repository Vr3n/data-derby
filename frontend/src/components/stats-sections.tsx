import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent } from "~/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "~/components/ui/table"

interface StatSection {
  title: string
  data: {
    position: string
    player: string
    team: string
    value: string | number
    image: string
  }[]
}

export function StatsSections() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    openPlay: true,
    teamGoals: true,
    shotsOnTarget: true,
    gamesWon: true,
    setPiece: true,
    rating: true,
    minutesPerGoal: true,
    interceptions: true,
  })

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const statSections: Record<string, StatSection> = {
    openPlay: {
      title: "OPEN PLAY KEY PASSES/90 MINUTES",
      data: [
        {
          position: "1st",
          player: "Daniel Luna",
          team: "Coruña",
          value: "2.37",
          image: "/placeholder.svg?height=40&width=40",
        },
        {
          position: "2nd",
          player: "Pablo Martínez",
          team: "Lugo",
          value: "2.36",
          image: "/placeholder.svg?height=40&width=40",
        },
        {
          position: "3rd",
          player: "Roberto Alarcón",
          team: "Leonesa",
          value: "2.21",
          image: "/placeholder.svg?height=40&width=40",
        },
      ],
    },
    teamGoals: {
      title: "TEAM GOALS",
      data: [
        {
          position: "1st",
          player: "Trilli",
          team: "Coruña",
          value: "42",
          image: "/placeholder.svg?height=40&width=40",
        },
        {
          position: "2nd",
          player: "Alfie Devine",
          team: "Coruña",
          value: "41",
          image: "/placeholder.svg?height=40&width=40",
        },
        {
          position: "=",
          player: "Alex Carbonell",
          team: "Coruña",
          value: "41",
          image: "/placeholder.svg?height=40&width=40",
        },
      ],
    },
    shotsOnTarget: {
      title: "SHOTS ON TARGET (%)",
      data: [
        {
          position: "1st",
          player: "Aitor Aranzabe",
          team: "Sestao",
          value: "83%",
          image: "/placeholder.svg?height=40&width=40",
        },
        {
          position: "2nd",
          player: "Victor Narro",
          team: "Coruña",
          value: "72%",
          image: "/placeholder.svg?height=40&width=40",
        },
        {
          position: "3rd",
          player: "Román Golobart",
          team: "Arenteiro",
          value: "71%",
          image: "/placeholder.svg?height=40&width=40",
        },
      ],
    },
    gamesWon: {
      title: "GAMES WON",
      data: [
        {
          position: "1st",
          player: "Trilli",
          team: "Coruña",
          value: "10",
          image: "/placeholder.svg?height=40&width=40",
        },
        {
          position: "2nd",
          player: "Alfie Devine",
          team: "Coruña",
          value: "9",
          image: "/placeholder.svg?height=40&width=40",
        },
        {
          position: "=",
          player: "Alex Carbonell",
          team: "Coruña",
          value: "9",
          image: "/placeholder.svg?height=40&width=40",
        },
      ],
    },
    setPiece: {
      title: "SET PIECE CROSSES ATTEMPTED",
      data: [
        {
          position: "1st",
          player: "Alex Collado",
          team: "Barcelona B",
          value: "7.36",
          image: "/placeholder.svg?height=40&width=40",
        },
        {
          position: "2nd",
          player: "Cristóbal",
          team: "Fuenlabrada",
          value: "6.43",
          image: "/placeholder.svg?height=40&width=40",
        },
        {
          position: "3rd",
          player: "Lucas Pérez",
          team: "Coruña",
          value: "6.36",
          image: "/placeholder.svg?height=40&width=40",
        },
      ],
    },
    rating: {
      title: "AVERAGE RATING",
      data: [
        {
          position: "1st",
          player: "Daniel Luna",
          team: "Coruña",
          value: "7.96",
          image: "/placeholder.svg?height=40&width=40",
        },
        {
          position: "2nd",
          player: "Ekain Orobengoa",
          team: "Real San Sebastian B",
          value: "7.72",
          image: "/placeholder.svg?height=40&width=40",
        },
        {
          position: "3rd",
          player: "Kuki Zalazar",
          team: "Coruña",
          value: "7.67",
          image: "/placeholder.svg?height=40&width=40",
        },
      ],
    },
    minutesPerGoal: {
      title: "AVERAGE MINUTES PER GOAL",
      data: [
        {
          position: "1st",
          player: "Kuki Zalazar",
          team: "Coruña",
          value: "45.33",
          image: "/placeholder.svg?height=40&width=40",
        },
        {
          position: "2nd",
          player: "Yuri",
          team: "Ponferrada",
          value: "86.33",
          image: "/placeholder.svg?height=40&width=40",
        },
        {
          position: "3rd",
          player: "Mohamed-Ali Cho",
          team: "Real San Sebastian B",
          value: "90.00",
          image: "/placeholder.svg?height=40&width=40",
        },
      ],
    },
    interceptions: {
      title: "INTERCEPTIONS/90 MINUTES",
      data: [
        {
          position: "1st",
          player: "Jonathan Gómez",
          team: "Real San Sebastian B",
          value: "3.67",
          image: "/placeholder.svg?height=40&width=40",
        },
        {
          position: "2nd",
          player: "Paris Adot",
          team: "Coruña",
          value: "3.64",
          image: "/placeholder.svg?height=40&width=40",
        },
        {
          position: "3rd",
          player: "Peter Pokorny",
          team: "Real San Sebastian B",
          value: "3.55",
          image: "/placeholder.svg?height=40&width=40",
        },
      ],
    },
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(statSections).map(([key, section], sectionIndex) => (
        <Card key={key} className="bg-white border">
          <div
            className="p-4 border-b flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection(key)}
          >
            <h3 className="text-sm font-bold text-gray-800">{section.title}</h3>
            {expandedSections[key] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>

          {expandedSections[key] && (
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="w-16"></TableHead>
                    <TableHead>PLAYER</TableHead>
                    <TableHead className="text-right">VALUE</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {section.data.map((item, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <TableCell className="font-medium">{item.position}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.player}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium">{item.player}</div>
                            <div className="text-xs text-gray-500">{item.team}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-bold">{item.value}</TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}

