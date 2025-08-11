
"use client";

import * as React from "react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function LogoHeader() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarMenu >
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" className={cn(

          "hover:bg-gray-200 hover:text-current",

          "focus:bg-transparent focus:outline-none"
        )}>
          <div className="flex items-center r w-full">
            {isCollapsed ? (
              <div className="w-10 h-10 relative">
                <Image
                  src="/assets/invodrop.png"
                  alt="InvoDrop"
                  fill
                  className="object-contain"
                  priority
                  sizes="40px"
                />
              </div>
            ) : (
              <div className="text-4xl font-bold tracking-wide self-start relative">
                <span className={cn(
                  "bg-gradient-to-r from-muted-foreground to-foreground/80",
                  "bg-clip-text text-transparent font-light"
                )}>
                  Invo
                </span>
                <span className={cn(
                  "bg-gradient-to-r from-primary via-primary/80 to-primary/60",
                  "bg-clip-text text-transparent font-black ml-1",
                  "relative"
                )}>
                  Drop


                  <div className={cn(
                    "absolute -bottom-1 left-0 w-full h-1",
                    "bg-gradient-to-r from-primary to-primary/60",
                    "rounded-full opacity-70"
                  )} />
                </span>


              </div>



            )}
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
