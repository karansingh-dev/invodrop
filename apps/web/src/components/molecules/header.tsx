import { Search } from "lucide-react";
import { Input } from "../ui/input";

export default function Header() {
  return (
    <div className="h-14 p-2 bg-background shadow-lg">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          id="searchBar"
          placeholder="Search..."
          className="w-xs rounded-md border border-border bg-background pl-8 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary"
        />
      </div>
    </div>
  );
}
