import { Search } from "lucide-react";
import { Input } from "../ui/input";

export default function SearchBar() {
  return (
    <div className="relative ">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-background" />
      <Input
        type="search"
        id="searchBar"
        placeholder="Search..."
        className="w-full rounded-md border-sidebar-foreground  pl-8 text-sm  placeholder:text-sidebar-foreground focus-visible:ring-1 focus-visible:ring-blue-500 "
      />
    </div>
  );
}
