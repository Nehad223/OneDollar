"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./components/Navbar";
import Search_Box from "./components/Search_Box";
import Grid_Items from "./components/Grid_Items";
import "./globals.css";
import "./main.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Cairo, Roboto } from "next/font/google";

const cairo = Cairo({ subsets: ["arabic"], weight: ["400","500","600","700"], variable: "--font-arabic" });
const roboto = Roboto({ subsets: ["latin"], weight: ["400","500","600","700"], variable: "--font-latin" });

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin"); // شرط لاستثناء الأدمن

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  return (
    <html>
      <body className={`${cairo.variable} ${roboto.variable}`}>
        {/* هيدر و search box والـ toast خاص بالواجهة العامة فقط */}
        {!isAdmin && (
          <>
            <div className="container">
              <Navbar />
              <Search_Box setQuery={setQuery} setResults={setResults} />
            </div>
          </>
        )}

        <div className="container">
          {!isAdmin && query.trim() ? (
            results.length > 0 ? (
              <Grid_Items items={results} />
            ) : (
              <div className="Search_Results empty">لا يوجد نتائج</div>
            )
          ) : (
            children
          )}
        </div>

        {!isAdmin && <ToastContainer position="top-center" autoClose={3000} />}

        {!isAdmin && (
          <script src="https://widget.cloudinary.com/v2.0/global/all.js"></script>
        )}
      </body>
    </html>
  );
}
