import { Link } from "@tanstack/react-router";
import { Card } from "./ui/card";
import { motion } from "framer-motion";


type CompetitionCardProps = {
  name: string;
  country?: string;
  image?: string;
  index?: number;
}

export function CompetitionCard({ name, country, image, index = 0 }: CompetitionCardProps) {
  return (
    <Card className="shadow-sm hover:shadow-md overflow-hidden border-0 rounded-lg p-0 group">
      <Link to="/" className="block">
        <motion.div
          className="relative aspect-[16/9] w-full overflow-hidden"
        >
          {/* image */}
          <motion.img
            src={image || "/placeholder.svg"}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" />

          {/* gradient overlay */}
          <div className="absolute inset-0 transition-colors duration-500 bg-gradient-to-t from-black/50 group-hover:from-black/80 to-transparent z-10 pointer-events-none" />

          {/* details */}
          <div className="absolute bottom-0 left-0 p-4 z-20 w-full pointer-events-none">

            <h3
              className="text-xl font-extrabold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all duration-300 group-hover:drop-shadow-[0_4px_8px_rgba(0,0,0,1)]">
              {name}
            </h3>
            <p className="text-base text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)] group-hover:drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
              {country}
            </p>
          </div>
        </motion.div>
      </Link>
    </Card>
  )
}
