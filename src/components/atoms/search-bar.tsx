import { Search } from "lucide-react";
import { Input } from "../ui/input";

export function SearchBar() {
  return (
    <div className="relative">
      <Input
        id="search-bar"
        type="text"
        className="w-xs"
        placeholder="Search..."
      />
      <Search className="w-4 h-4 text-gray-500 absolute top-2 right-2" />
    </div>
  );
}