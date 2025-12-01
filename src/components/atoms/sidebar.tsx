"use client";
import {
  ChartBarBig,
  FileText,
  FileTextIcon,
  HomeIcon,
  Users2,
  Wallet2Icon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";

const links = [
  { to: "dashboard", label: "Dashboard", icon: HomeIcon },
  { to: "invoice", label: "Invoices", icon: FileTextIcon },
  { to: "client", label: "Clients", icon: Users2 },
  { to: "payment", label: "Payments", icon: Wallet2Icon },
  { to: "report", label: "Reports", icon: ChartBarBig },
];

export default function SideBar() {
  const pathname = usePathname();

  return (
    <div className="w-60 border-r bg-white   h-screen flex flex-col">
      <div className="h-16 w-full px-6 border-b flex items-center gap-3">
        <div className="bg-primary p-2 rounded-lg shadow">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl bbh-sans-hegarty font-semibold text-gray-700">
          InvoDrop
        </h1>
      </div>

      <nav className="px-3 py-6 flex flex-col gap-2">
        {links.map((l, idx) => {
          const isActive = pathname.startsWith(`/${l.to}`);

          const Icon = l.icon;

          return (
            <Link
              key={idx}
              href={`/${l.to}`}
              className={clsx(
                "flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-all",
                isActive
                  ? "bg-primary/10 text-primary "
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <Icon
                className={clsx(
                  "w-4 h-4",
                  isActive ? "text-primary" : "text-gray-500"
                )}
              />
              <span>{l.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
