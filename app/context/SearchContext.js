"use client";
import { createContext, useState } from "react";

export const SearchContext = createContext({});

export const SearchProvider = ({ children }) => {
  const [categoryId, setCategoryId] = useState(null); // null → البحث عام

  return (
    <SearchContext.Provider value={{ categoryId, setCategoryId }}>
      {children}
    </SearchContext.Provider>
  );
};

