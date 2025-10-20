"use client";
import BookingForm from "../components/BookingForm";
import React from "react";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4 text-center">Make a Reservation</h1>
        <BookingForm />
      </div>
    </main>
  );
}
