"use client";

import { useLoaderStore } from "@/store/useLoaderStore";
import "./loader.css"; 

export default function GlobalLoader() {
  const loading = useLoaderStore((state) => state.loading);

  if (!loading) return null;

  return (
    <div className="global-loader-overlay">
      <div className="gold-spinner"></div>
    </div>
  );
}
