"use client";

import React, { useState } from "react";

type NavProps = {
  onLogout?: () => void;
  isAdmin?: boolean;
};

export default function Nav({ onLogout, isAdmin }: NavProps) {
  const [loading, setLoading] = useState(false);
  
  const isHomePage = typeof window !== 'undefined' && window.location.pathname === '/';

  const logout = async () => {
    setLoading(true);
    try {
      await fetch("/api/admin/logout", { method: "POST", credentials: "same-origin" });
    } catch (e) {
      // ignore errors
    } finally {
      setLoading(false);
      if (typeof onLogout === "function") onLogout();
    }
  };

  return (
    <header className="w-full bg-white border-b py-3 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <a href="/" className="text-lg text-slate-700 font-semibold" aria-label="App Name">
          RZVR-ansatt
        </a>
      </div>
      <div className="flex items-center gap-4">
        {/* Show Admin link when on home page, Home link when elsewhere */}
        {isHomePage ? (
          <a href="/admin" className="px-3 py-1 bg-blue-500 text-white rounded" aria-label="Go to Admin">
            Admin
          </a>
        ) : (
          <a href="/" className="px-3 py-1 bg-blue-500 text-white rounded" aria-label="Go to Home">
            Home
          </a>
        )}
        <button
          onClick={logout}
          disabled={loading}
          className="px-3 py-1 bg-red-600 text-white rounded"
        >
          {loading ? "Signing out…" : "Logout"}
        </button>
      </div>
    </header>
  );
}
