"use client";
import BookingForm from "../components/BookingForm";
import VippsForm from "../components/Vipps/VippsForm";
import { useState } from "react";
import Nav from "../components/Admin/Nav";
import useAdminSession from "../components/hooks/useAdminSession";

export default function Home() {
  const [bookingData, setBookingData] = useState<Record<string, string> | null>(null);
  const { payload, logout } = useAdminSession();

  if (bookingData) {
    return (
      <div className="min-h-screen bg-gray-50">
        {payload && (
          <Nav isAdmin={Boolean(payload?.isAdmin)} onLogout={logout} />
        )}
        
        <main className="flex flex-col items-center justify-center px-6 py-12">
          <div className="w-full max-w-md p-6 bg-white rounded-xl shadow">
            <VippsForm booking={bookingData} />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {payload?.isAdmin && (
        <Nav isAdmin={Boolean(payload?.isAdmin)} onLogout={logout} />
      )}
      
      <main className="flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md p-6 bg-white rounded-xl shadow">
          <h1 className="text-2xl font-bold mb-4 text-center">Gjør en reservasjon</h1>
          <BookingForm onSubmit={(data) => setBookingData(data)} />
        </div>
      </main>
    </div>
  );
}
