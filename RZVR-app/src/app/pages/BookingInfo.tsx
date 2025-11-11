"use client";
import React from "react";
import Nav from "../components/Admin/Nav";
import useAdminSession from "../components/hooks/useAdminSession";

export default function BookingInfo() {
  const { payload, logout } = useAdminSession();

  return (
    <div className="min-h-screen bg-gray-50">
      {payload && (
        <Nav isAdmin={Boolean(payload?.isAdmin)} onLogout={logout} />
      )}
      
      <main className="flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md p-6 bg-white rounded-xl shadow">
          <h1 className="text-2xl font-bold mb-4 text-center">Booking Info</h1>
          <p className="text-center">(Placeholder)</p>
        </div>
      </main>
    </div>
  );
}
