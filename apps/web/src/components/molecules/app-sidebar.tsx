"use client"

import * as React from "react"
import {
  AudioWaveform,

  Command,
  CreditCard,
  FileChartColumnIncreasing,

  FileText,
  Frame,
  GalleryVerticalEnd,
  Home,
  Map,
  PieChart,

  Users,
} from "lucide-react"


import { NavSettings } from "@/components/molecules/nav-settings"
import { NavUser } from "@/components/molecules/nav-user"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavMain } from "./nav-main"
import { LogoHeader } from "./logo-header"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },

  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,


    },
    {
      title: "Invoices",
      url: "/invoices",
      icon: FileText,

    },
    {
      title: "Clients",
      url: "/clients",
      icon: Users,

    },
    {
      title: "Payments",
      url: "/payments",
      icon: CreditCard,

    },
    {
      title: "Reports",
      url: "/reports",
      icon: FileChartColumnIncreasing,
    }
  ],
  settings: [
    {
      name: "Invoice Setting",
      url: "#",
      icon: Frame,
    },
    {
      name: "Tax Setting",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Payment Setting",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} className="shadow-md ">
      <SidebarHeader>
        <LogoHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSettings settings={data.settings} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
