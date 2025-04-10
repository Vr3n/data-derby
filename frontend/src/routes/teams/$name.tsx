import { createFileRoute } from '@tanstack/react-router'
import { useParams } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { cn } from '~/lib/utils';
import { Slider } from '~/components/ui/slider';
import { useEffect, useState } from 'react';
import { Avatar } from '~/components/ui/avatar';

import {
  RadarChartCard,
  type RadarSegment,
  type RadarCategory
} from "~/components/charts/radar"

// Animation variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

type StatItem = {
  name: string;
  value: number;
  leftLabel: string;
  rightLabel: string;
}


type TeamData = {
  name: string;
  season: string;
  status: string;
  matches: number;
  points: number;
  goals: number;
  xG: number;
  xD: number;
  GF: number;
  styleOfPlay: StatItem[];
  performance: StatItem[];
}



type StatSliderProps = React.HtmlHTMLAttributes<HTMLDivElement> & {
  label?: string;
  leftLabel: string;
  rightLabel: string;
  value: number;
}


// Custom slider component with label
const StatSlider = ({ label, leftLabel, rightLabel, value, className }: StatSliderProps) => {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
      <div className="relative pt-1">
        <div className="text-center text-sm font-medium -mb-1">{value}</div>
        <Slider disabled defaultValue={[value]} max={10} step={0.1} />
      </div>
    </div>
  );
};


const teamRadarData: RadarSegment[] = [
  { name: "Attack", value: 79, startAngle: -90, endAngle: -45, category: "Attack" },
  { name: "Shot quality", value: 71, startAngle: -45, endAngle: 0, category: "Attack" },
  { name: "Chance creation", value: 73, startAngle: 0, endAngle: 45, category: "Defence" },
  { name: "Defence", value: 75, startAngle: 45, endAngle: 90, category: "Defence" },
  { name: "Pressure", value: 85, startAngle: 90, endAngle: 135, category: "Defence" },
  { name: "Possession", value: 92, startAngle: 135, endAngle: 180, category: "Possession" },
  { name: "Transition", value: 90, startAngle: 180, endAngle: 225, category: "Possession" },
  { name: "Fouls", value: 93, startAngle: 225, endAngle: 270, category: "Duels" },
  { name: "Aerial duels", value: 95, startAngle: 270, endAngle: -45, category: "Duels" },
  { name: "Ground duels", value: 89, startAngle: -45, endAngle: -90, category: "Duels" },
];

const radarCategories: RadarCategory[] = [
  { name: "Attack", color: "#3b82f6" }, // Blue
  { name: "Defence", color: "#be123c" }, // Red
  { name: "Possession", color: "#065f46" }, // Green
  { name: "Duels", color: "#f59e0b" }, // Orange
];


export const Route = createFileRoute('/teams/$name')({
  component: RouteComponent,
})

function RouteComponent() {
  const { name } = useParams({ strict: false });

  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [isLoading, setIsLoading] = useState(true)

  // Simulating the data fetching.
  useEffect(() => {
    // This would be a real API call in production
    setTimeout(() => {
      setTeamData({
        name: name || "team_name",
        season: "2023-2024",
        matches: 28,
        points: 45,
        goals: 15,
        xG: 15,
        xD: 36,
        GF: 15,
        styleOfPlay: [
          { name: "Patient vs Direct", value: 4.6, leftLabel: "Patient", rightLabel: "Direct" },
          { name: "Forward press low vs Forward press more", value: 6.5, leftLabel: "Forward press low", rightLabel: "Forward press more" },
          { name: "Close-range shots vs Long-range shots", value: 2.3, leftLabel: "Close-range shots", rightLabel: "Long-range shots" },
          { name: "Less crosses vs More crosses", value: 2.8, leftLabel: "Less crosses", rightLabel: "More crosses" },
          { name: "Short passes vs Long passes", value: 3.7, leftLabel: "Short passes", rightLabel: "Long passes" },
          { name: "Less offsides vs More offsides", value: 3.4, leftLabel: "Less offsides", rightLabel: "More offsides" },
          { name: "Less dribbles vs More dribbles", value: 5.3, leftLabel: "Less dribbles", rightLabel: "More dribbles" },
          { name: "Passive defending vs Active defending", value: 3.4, leftLabel: "Passive defending", rightLabel: "Active defending" },
          { name: "Less fouls vs More fouls", value: 5.1, leftLabel: "Less fouls", rightLabel: "Often commit fouls" },
          { name: "Less counter-attacks vs More counter-attacks", value: 5.9, leftLabel: "Less counter-attacks", rightLabel: "More counter-attacks" }
        ],
        performance: [
          { name: "Create less chances vs Create more chances", value: 6.5, leftLabel: "Create less chances", rightLabel: "Create more chances" },
          { name: "Concede less chances vs Concede more chances", value: 5.2, leftLabel: "Concede less chances", rightLabel: "Concede more chances" },
          { name: "Bad finishing vs Good finishing", value: 5.4, leftLabel: "Bad finishing", rightLabel: "Good finishing" },
          { name: "Often lose possession vs Rarely lose possession", value: 5.5, leftLabel: "Often lose possession", rightLabel: "Rarely lose possession" }
        ]
      });
      setIsLoading(false);
    }, 500);
  }, [name]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-lg font-medium"
        >
          Loading team data...
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container py-6 space-y-8"
    >
      {/* Team Header */}
      <motion.div
        variants={itemVariants}
        className="flex items-center gap-4 border-b pb-4"
      >
        <Avatar className="h-12 w-12 bg-gray-200">
          {/* Team logo would go here */}
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{teamData?.name}</h1>
          <p className="text-sm text-muted-foreground">
            {teamData?.season}
          </p>
        </div>
      </motion.div>

      {/* Stats Overview and Radar Chart */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Key Stats */}
        <motion.div
          variants={itemVariants}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Matches Played</p>
              <p className="text-xl font-medium">{teamData?.matches}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Points</p>
              <p className="text-xl font-medium">{teamData?.points}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Goals</p>
              <p className="text-xl font-medium">{teamData?.goals}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">xG</p>
              <p className="text-xl font-medium">{teamData?.xG}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">xD</p>
              <p className="text-xl font-medium">{teamData?.xD}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">GF</p>
              <p className="text-xl font-medium">{teamData?.GF}</p>
            </div>
          </div>

          <div className="pt-4">
            <p className="text-sm text-muted-foreground">Competitions Played</p>
            <div className="flex gap-2 mt-2">
              <div className="h-8 w-8 bg-gray-200 rounded-md"></div>
              <div className="h-8 w-8 bg-gray-200 rounded-md"></div>
              <div className="h-8 w-8 bg-gray-200 rounded-md"></div>
            </div>
          </div>
        </motion.div>

        {/* Radar Chart */}
        <motion.div
          variants={itemVariants}
          className="aspect-square"
        >
          <RadarChartCard
            segments={teamRadarData}
            categories={radarCategories}
          />
        </motion.div>
      </div>

      {/* Style of Play Section */}
      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-semibold mb-4">Style of Play</h2>
        <div className="space-y-6">
          {teamData?.styleOfPlay.map((stat, index) => (
            <StatSlider
              key={index}
              label={stat.name}
              leftLabel={stat.leftLabel}
              rightLabel={stat.rightLabel}
              value={stat.value}
              className="max-w-3xl"
            />
          ))}
        </div>
      </motion.div>

      {/* Performance Section */}
      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-semibold mb-4">Performance</h2>
        <div className="space-y-6">
          {teamData?.performance.map((stat, index) => (
            <StatSlider
              key={index}
              label={stat.name}
              leftLabel={stat.leftLabel}
              rightLabel={stat.rightLabel}
              value={stat.value}
              className="max-w-3xl"
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
