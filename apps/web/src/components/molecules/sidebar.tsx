"use client";

import clsx from "clsx";
import { BarChart, FileText, House, Settings, Users2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserProfile } from "../atoms/user-profile";
import InvoDropLogo from "../atoms/invodrop-logo";

export default function SideBar() {
  const pathname = usePathname();

  const mainLinks = [
    { key: "Dashboard", name: "Dashboard", to: "/dashboard", icon: House },
    { key: "Invoices", name: "Invoices", to: "/invoices", icon: FileText },
    { key: "Clients", name: "Clients", to: "/clients", icon: Users2 },
    { key: "Reports", name: "Reports", to: "/reports", icon: BarChart },
  ];

  const settingLinks = [
    {
      key: "Settings",
      name: "Settings",
      to: "/settings/profile",
      icon: Settings,
    },
  ];

  return (
    <div className="w-64 bg-background text-foreground  flex flex-col  shadow-lg">
      {/* Header */}
      <div className="flex  h-14 items-center px-6 mb-2">
        <div className="flex items-center gap-2">
          <div className="bg-background rounded-sm ">
            <InvoDropLogo className="h-12" />
          </div>
          <Link href="/">
            <span className="font-semibold text-foreground text-2xl tracking-wide">
              InvoDrop
            </span>
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2">
        {/* Main Section */}
        <div>
          <h2 className="mb-2 text-xs text-muted-foreground font-bold uppercase tracking-wider px-4">
            Main
          </h2>
          <div>
            {mainLinks.map(({ key, name, to, icon: Icon }) => (
              <Link
                key={key}
                href={to}
                className={clsx(
                  "flex items-center gap-3 mb-1 rounded-md px-4 py-2 text-sm font-medium transition-colors",
                  pathname === to
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted/50 hover:text-accent-foreground text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {name}
              </Link>
            ))}
          </div>
        </div>

        {/* Settings Section */}
        <div className="mt-4">
          <h2 className="mb-2 text-xs text-muted-foreground font-bold uppercase tracking-wider px-4">
            Settings
          </h2>
          <div>
            {settingLinks.map(({ key, name, to, icon: Icon }) => (
              <Link
                key={key}
                href={to}
                className={clsx(
                  "flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium transition-colors",
                  pathname === to
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted/50 hover:text-accent-foreground text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* User profile pinned at bottom */}

      <UserProfile />
    </div>
  );
}
