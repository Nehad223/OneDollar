"use client";

import { useState } from "react";
import "../admin.css";
import Navbar from "../../components/Navbar";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      redirect: "follow", // مهم
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error);
    }

  };

  return (
    <>
      <Navbar />

      <div className="Admin_Login container">
        <h1>Admin Login</h1>

        <div className="login-card">
          {error && <p style={{ color: "red" }}>{error}</p>}

          <input
            type="text"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={handleLogin}>Login</button>
        </div>
      </div>
    </>
  );
}
