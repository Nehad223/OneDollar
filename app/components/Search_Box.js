"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import Image from "next/image";

const Search_Box = ({ setQuery, setResults }) => {
  const pathname = usePathname();
  const categoryId = useMemo(() => {
    const parts = pathname.split("/");
    if (parts[1] === "categories" && parts[2]) {
      return parts[2];
    } else {
      return null;
    }
  }, [pathname]);

  const handleSearch = async (value) => {
    setQuery(value);
    const q = value.trim();

    if (!q) {
      setResults([]);
      return;
    }

    try {
      const url = `/api/search?query=${encodeURIComponent(q)}${
        categoryId ? `&categoryId=${categoryId}` : ""
      }`;

      const res = await fetch(url);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
    }
  };

  return (
    <div className="Search_Box">
      <input
        placeholder="بحث عن منتج..."
        onChange={(e) => handleSearch(e.target.value)}
      />
      <span className="icon">
        <Image src="/search.png" width={20} height={20} alt="search" />
      </span>
    </div>
  );
};

export default Search_Box;
