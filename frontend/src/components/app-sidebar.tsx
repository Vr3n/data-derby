import * as React from "react";
import {
  Bot,
  SquareTerminal,
  Vegan,
  CircleUserRound,
} from "lucide-react";

import { NavMain } from "~/components/nav-main";
import { NavUser } from "~/components/nav-user";
import { TeamSwitcher } from "~/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "~/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "Suresh Patel",
    email: "admin@crown.com",
    avatar: CircleUserRound,
  },
  teams: [
    {
      name: "Crown Vitality",
      logo: Vegan,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Clients",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "All Clients",
          url: "clients/",
        },
        {
          title: "Diets",
          url: "#",
        },
        {
          title: "Workouts",
          url: "#",
        },
        {
          title: "Follow Up",
          url: "#",
        },
      ],
    },
    {
      title: "Ai Chat",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Diet Chat",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
