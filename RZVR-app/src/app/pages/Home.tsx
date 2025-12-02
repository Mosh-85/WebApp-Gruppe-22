"use client";
import { useState } from "react";
import BookingForm from "../components/BookingForm";
import VippsForm from "../components/Vipps/VippsForm";
import Nav from "../components/Admin/Nav";
import useAdminSession from "../components/hooks/useAdminSession";

export default function Home() {
  const [bookingData, setBookingData] = useState<Record<string, string> | null>(null);
  const { payload, logout } = useAdminSession();

  async function handleBookingSubmit(data: Record<string, string>) {
    // 1) Vis Vipps-siden (samme som før)
    setBookingData(data);

    // 2) Lagre booking i databasen
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data), // fullName, people, email, date, time (+ ev. mobile)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("Kunne ikke lagre booking:", err);
        // Valgfritt: vis en melding til bruker
        // alert(`Kunne ikke lagre booking: ${err.error ?? res.status}`);
      } else {
        console.log("Booking lagret i DB ✅");
      }
    } catch (e) {
      console.error("Feil ved lagring av booking:", e);
      // Valgfritt: alert("En feil oppstod ved lagring av booking.");
    }
  }

  // Når bookingData er satt -> vis Vipps-siden
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

  // Før innsending → vis vanlig booking-skjema
  return (
    <div className="min-h-screen bg-gray-50">
      {payload?.isAdmin && (
        <Nav isAdmin={Boolean(payload?.isAdmin)} onLogout={logout} />
      )}

      <main className="flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md p-6 bg-white rounded-xl shadow">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Gjør en reservasjon
          </h1>
          <BookingForm onSubmit={handleBookingSubmit} />
        </div>
      </main>
    </div>
  );
}
