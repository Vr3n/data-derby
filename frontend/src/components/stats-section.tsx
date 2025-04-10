import { motion } from "framer-motion"
import { ChevronDown, ChevronUp, Minus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { Badge } from "~/components/ui/badge"

interface StatsSectionProps {
  title: string
  data: {
    position: number
    team: string
    value: number
    trend: "up" | "down" | "neutral"
  }[]
  streakData?: {
    result: string
    count: number
  }[]
  valuePrefix?: string
  valueSuffix?: string
}

export function StatsSection({ title, data, streakData, valuePrefix = "", valueSuffix = "" }: StatsSectionProps) {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <ChevronUp className="h-4 w-4 text-green-500" />
      case "down":
        return <ChevronDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />
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
    <Card
      className="h-full"
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-black/30">
            <TableRow>
              <TableHead className="w-10">#</TableHead>
              <TableHead>Team</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <motion.tr
                key={item.position}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <TableCell className="font-medium">{item.position}</TableCell>
                <TableCell>
                  <div className="h-6 w-6 rounded-full flex items-center justify-center text-xs">
                    {item.team.charAt(0)}
                  </div>
                  {item.team}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <span className="font-bold">
                      {valuePrefix}
                      {item.value}
                      {valueSuffix}
                    </span>
                    {getTrendIcon(item.trend)}
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>

        {streakData && (
          <div className="p-4 border-t">
            <div className="flex gap-1">
              {streakData.map((streak, index) => (
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
  )
}

