import { Search } from "lucide-react";

export default function SearchBar(props) {
  return (
    <>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        placeholder="Search devices or rooms..."
        value={props.searchQuery}
        onChange={(e) => props.setSearchQuery(e.target.value)}
        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
      />
    </>
  );
}
