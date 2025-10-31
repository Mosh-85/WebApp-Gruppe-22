"use client";

import { useEffect, useState, useCallback } from "react";

export default function useAdminSession() {
  const [payload, setPayload] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/me`, { credentials: "same-origin" });
      if (!res.ok) {
        setPayload(null);
        return null;
      }
      const j = (await res.json().catch(() => null)) as any;
      setPayload(j?.payload ?? null);
      return j?.payload ?? null;
    } catch (e) {
      setPayload(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST", credentials: "same-origin" });
    } catch (e) {
      console.warn("Logout endpoint failed:", e);
    }
    setPayload(null);
    
    window.location.replace("/");
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { payload, loading, refresh, logout };
}
