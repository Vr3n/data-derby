import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { Link } from "@tanstack/react-router";

// Types.
export type RawLeagueRow = {
  rank: string;
  ties: string;
  wins: string;
  games: string;
  notes: string;
  last_5: string;
  losses: string;
  points: string;
  xg_for: string;
  xg_diff: string;
  goal_diff: string;
  goals_for: string;
  points_avg: string;
  top_keeper: string;
  xg_against: string;
  goals_against: string;
  xg_diff_per90: string;
  attendance_per_g: string;
};

export type LeagueTableRow = {
  // Display columns
  position: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: string[];

  // Extra data (from RawLeagueRow)
  xgFor: number;
  xgAgainst: number;
  xgDiff: number;
  xgDiffPer90: number;
  pointsAvg: number;
  topKeeper: string;
  attendancePerGame: number;
  notes?: string;
};

// Helper function for mapping data to rows.
export function mapApiToLeagueRow(
  raw: RawLeagueRow,
  teamName: string
): LeagueTableRow {
  const parseNumber = (val: string) =>
    parseFloat(val.replace(/,/g, "").replace("+", "") || "0");

  return {
    position: parseInt(raw.rank),
    team: teamName,
    played: parseInt(raw.games),
    won: parseInt(raw.wins),
    drawn: parseInt(raw.ties),
    lost: parseInt(raw.losses),
    goalsFor: parseInt(raw.goals_for),
    goalsAgainst: parseInt(raw.goals_against),
    goalDifference: parseInt(raw.goal_diff.replace("+", "") || "0"),
    points: parseInt(raw.points),
    form: raw.last_5.trim().split(/\s+/),

    // extended stats
    xgFor: parseNumber(raw.xg_for),
    xgAgainst: parseNumber(raw.xg_against),
    xgDiff: parseNumber(raw.xg_diff),
    xgDiffPer90: parseNumber(raw.xg_diff_per90),
    pointsAvg: parseNumber(raw.points_avg),
    attendancePerGame: parseNumber(raw.attendance_per_g),
    topKeeper: raw.top_keeper,
    notes: raw.notes,
  };
}

const DiffCell = ({ value }: { value: number }) => {
  const color =
    value > 0 ? "text-green-600" : value < 0 ? "text-red-500" : "text-gray-600";
  const sign = value > 0 ? "+" : "";

  return (
    <span className={`font-mono ${color} text-right`}>
      {sign}
      {value.toFixed(2)}
    </span>
  );
};

type LeagueTableProps = {
  leagueData: LeagueTableRow[];
};

const COLUMNS = [
  ["position", "#"],
  ["team", "Team"],
  ["played", "P"],
  ["won", "W"],
  ["drawn", "D"],
  ["lost", "L"],
  ["goalsFor", "GF"],
  ["goalsAgainst", "GA"],
  ["goalDifference", "GD"],
  ["points", "PTS"],
  ["xgFor", "xG"],
  ["xgAgainst", "xGA"],
  ["xgDiff", "xGD"],
  ["xgDiffPer90", "xGD/90"],
  ["form", "Last 5 games"],
];

export function LeagueTable({ leagueData }: LeagueTableProps) {
  const [sortColumn, setSortColumn] =
    useState<keyof LeagueTableRow>("position");
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column as keyof LeagueTableRow);
      setSortDirection("asc");
    }
  };

  const sortedData = [...leagueData].sort((a, b) => {
    const aValue = a[sortColumn as keyof typeof a];
    const bValue = b[sortColumn as keyof typeof b];

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });

  const getFormBadgeColor = (result: string) => {
    switch (result) {
      case "W":
        return "bg-green-500 text-white";
      case "D":
        return "bg-amber-500 text-white";
      case "L":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortColumn !== column) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  return (
    <div className="overflow-x-auto rounded-md border bg-white">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            {COLUMNS.map(([col, label]) => (
              <TableHead
                key={col}
                className="cursor-pointer"
                onClick={() => handleSort(col as keyof LeagueTableRow)}
              >
                <div className="flex items-center justify-center gap-1">
                  {label} <SortIcon column={col as keyof LeagueTableRow} />
                </div>
              </TableHead>
            ))}
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
              <TableCell className="text-center font-medium">
                {team.position}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white">
                    {team.team.charAt(0)}
                  </div>
                  <Link
                    className="hover:underline"
                    to="/teams/$name"
                    params={{ name: team.team }}
                  >
                    {team.team}
                  </Link>
                </div>
              </TableCell>
              <TableCell className="text-center">{team.played}</TableCell>
              <TableCell className="text-center">{team.won}</TableCell>
              <TableCell className="text-center">{team.drawn}</TableCell>
              <TableCell className="text-center">{team.lost}</TableCell>
              <TableCell className="text-center">{team.goalsFor}</TableCell>
              <TableCell className="text-center">{team.goalsAgainst}</TableCell>
              <TableCell className="text-center">
                <DiffCell value={team.goalDifference} />
              </TableCell>
              <TableCell className="text-center font-bold">
                {team.points}
              </TableCell>
              <TableCell className="text-center">
                {team.xgFor.toFixed(1)}
              </TableCell>
              <TableCell className="text-center">
                {team.xgAgainst.toFixed(1)}
              </TableCell>
              <TableCell className="text-center">
                <DiffCell value={team.xgDiff} />
              </TableCell>
              <TableCell className="text-center">
                <DiffCell value={team.xgDiffPer90} />
              </TableCell>
              <TableCell>
                <div className="flex gap-1 justify-center">
                  {team.form.map((result, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className={`w-6 h-6 p-0 flex items-center justify-center ${getFormBadgeColor(
                        result
                      )}`}
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
  );
}
