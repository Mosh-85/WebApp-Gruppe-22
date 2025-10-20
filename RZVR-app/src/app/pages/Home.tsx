"use client";
import BookingForm from "../components/BookingForm";
import VippsForm from "../components/Vipps/VippsForm";
import React, { useState } from "react";

export default function Home() {
  const [bookingData, setBookingData] = useState<Record<string, string> | null>(null);

  if (bookingData) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-md p-6 bg-white rounded-xl shadow">
          <VippsForm booking={bookingData} />
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4 text-center">Gjør en reservasjon</h1>
        <BookingForm onSubmit={(data) => setBookingData(data)} />
      </div>
    </main>
  );
}
