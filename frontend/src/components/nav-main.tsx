import { Link } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";

// type NavMainTypes = {
//   items: {
//     title: string;
//     url: string;
//     icon?: LucideIcon;
//     isActive?: boolean;
//     items?: {
//       title: string;
//       url: string;
//     }[];
//   }[];
// };

export function NavMain() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            <span className="text-xl font-bold tracking-tight">Data-Derby</span>
          </Link>
        </div>
        <nav className="hidden md:flex gap-6">
          <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
            Competitions
          </Link>
          <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
            Teams
          </Link>
          <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
            Players
          </Link>
          <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
            Compare
          </Link>
        </nav>
      </div>
    </header>
  );
}
