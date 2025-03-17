"use client";

import {
  AudioWaveform,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Général",
      url: "#",
      icon: SquareTerminal,
      items: [
        {
          title: "Analytics",
          url: "/dashboard/analytics",
        },
        {
          title: "Avis",
          url: "/dashboard/reviews",
        },
      ],
    },
    {
      title: "Catalogue",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Fournisseurs",
          url: "/dashboard/sellers",
        },
        {
          title: "Catégories",
          url: "/dashboard/categories",
        },
        {
          title: "Sous-catégories",
          url: "/dashboard/sub-categories",
        },
        {
          title: "Produits",
          url: "/dashboard/products",
        },
        {
          title: "Packs",
          url: "/dashboard/packs",
        },
      ],
    },
    {
      title: "Ventes",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Commandes",
          url: "/dashboard/orders",
        },
        {
          title: "Paniers",
          url: "/dashboard/carts",
        },
        {
          title: "Retours",
          url: "/dashboard/returns",
        },
      ],
    },
    {
      title: "Utilisateurs",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Equipe",
          url: "/dashboard/team",
        },
        {
          title: "Clients",
          url: "/dashboard/clients",
        },
        {
          title: "Parrainage",
          url: "/dashboard/referrals",
        },
      ],
    },
    {
      title: "Réglages",
      url: "#",
      icon: SquareTerminal,
      items: [
        {
          title: "Système",
          url: "/dashboard/settings",
        },
        {
          title: "Marketing",
          url: "/dashboard/marketing",
        },
        {
          title: "Codes promo",
          url: "/dashboard/promo-codes",
        },
        {
          title: "Ventes flash",
          url: "/dashboard/flash-sales",
        },
        {
          title: "Zones de livraison",
          url: "/dashboard/delivery-zones",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
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
