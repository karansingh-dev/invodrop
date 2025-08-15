"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useSession } from "@/lib/auth-client";
import { Skeleton } from "../ui/skeleton";
import { ExtendedUser } from "@/types/better-auth/extendedUser";
import { useSignOut } from "@/actions/logout";
import BasicLoader from "./basic-loader";

export function UserProfile() {
  const { data: session, isPending } = useSession();

  const { signOut, loading } = useSignOut();

  if (isPending || !session) return <Skeleton />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex border-t p-2 items-center gap-2 hover:bg-foreground/10 py-2">
        <Avatar className="h-8 w-8 rounded-lg">
          <AvatarImage
            src={(session.user as ExtendedUser).image as undefined | string}
            alt={session.user.name}
          />
          <AvatarFallback className="rounded-lg">CN</AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-medium">
            {(session.user as ExtendedUser).name}
          </span>
          <span className="truncate text-xs">
            {(session.user as ExtendedUser).email}
          </span>
        </div>
        <ChevronsUpDown className="ml-auto size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width)  min-w-56 rounded-lg ml-1 mb-4"
        align="end"
        side="right"
        sideOffset={4}
      >
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Sparkles />
            Upgrade to Pro
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BadgeCheck />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard />
            Billing
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async (e) => {
            e.preventDefault();
            await signOut();
          }}
        >
          <LogOut />
          {loading ? <BasicLoader /> : <p>Logout</p>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
