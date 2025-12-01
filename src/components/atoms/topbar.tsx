"use client";

import { UserProfile } from "../molecules/user-profile";
import { DropdownMenu } from "../ui/dropdown-menu";
import { SearchBar } from "./search-bar";

export default function Topbar() {
  return (
    <div className="h-16 w-full bg-white border-b flex justify-between items-center px-4">
      <SearchBar />

      <div>
        <UserProfile />
      </div>
    </div>
  );
}
