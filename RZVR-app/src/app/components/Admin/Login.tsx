"use client";

import React, { useState } from "react";

type LoginProps = {
  onSuccess?: (payload?: any) => void;
};

export default function Login({ onSuccess }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ username, password }),
      });
      const body = (await res.json().catch(() => null)) as any;
      if (!res.ok) {
        setError(body?.error ?? `HTTP ${res.status}`);
        return;
      }
      let payload = null;
      try {
        const me = await fetch("/api/admin/me", { credentials: "same-origin" });
        if (me.ok) {
          const body = (await me.json().catch(() => null)) as any;
          payload = body?.payload ?? null;
        }
      } catch (e) {
        // ignore
      }
      if (typeof onSuccess === "function") {
        try {
          onSuccess(payload);
        } catch (e) {
          /* ignore */
        }
      } else {
        // redirect to /admin
        window.location.href = "/admin";
      }
    } catch (err: any) {
      setError(String(err?.message ?? err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="email"
          required
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Logger inn..." : "Logg inn"}
      </button>
      <div className="mt-4 text-sm text-gray-500 text-center">
        Development tip: use <code className="bg-gray-100 px-1 rounded">admin@example.com</code> / <code className="bg-gray-100 px-1 rounded">password</code>
      </div>
    </form>
  );
}
