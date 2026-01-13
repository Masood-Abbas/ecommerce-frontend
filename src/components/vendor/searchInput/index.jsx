import { useState, useEffect } from "react";
import useDebounce from "@/hooks/useDebounce";

export default function SearchInputApi({  onResults,className,placeholder }) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 600);

  // Send search text to parent
  useEffect(() => {
    onResults(debouncedQuery);
  }, [debouncedQuery]);

  return (
    <input
      type="text"
      placeholder={placeholder || "Search product..."}
      className={`border rounded px-3 py-2 w-full ${className}`}
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
