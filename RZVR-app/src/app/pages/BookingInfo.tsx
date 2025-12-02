"use client";
import React, { useEffect, useState } from "react";
import Nav from "../components/Admin/Nav";
import useAdminSession from "../components/hooks/useAdminSession";

type BookingInfoData = {
  fullName: string;
  people: string;
  email: string;
  date: string;
  time: string;
  mobile: string;
};

export default function BookingInfo() {
  const { payload, logout } = useAdminSession();
  const [booking, setBooking] = useState<BookingInfoData | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);

    const fullName = params.get("fullName") ?? "";
    const people = params.get("people") ?? "";
    const email = params.get("email") ?? "";
    const date = params.get("date") ?? "";
    const time = params.get("time") ?? "";
    const mobile = params.get("mobile") ?? "";

    // If nothing is present, keep it null (fallback text)
    if (!fullName && !people && !email && !date && !time && !mobile) {
      setBooking(null);
    } else {
      setBooking({ fullName, people, email, date, time, mobile });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {payload && (
        <Nav isAdmin={Boolean(payload?.isAdmin)} onLogout={logout} />
      )}

      <main className="flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md p-6 bg-white rounded-xl shadow">
          <h1 className="text-2xl font-bold mb-4 text-center">Booking Info</h1>

          {!booking ? (
            <p className="text-center text-gray-500">
              Fant ingen booking-data i URLen.
            </p>
          ) : (
            <div className="space-y-3">
              <p>
                <span className="font-semibold">Navn:</span>{" "}
                {booking.fullName}
              </p>
              <p>
                <span className="font-semibold">Antall personer:</span>{" "}
                {booking.people}
              </p>
              <p>
                <span className="font-semibold">E-post:</span>{" "}
                {booking.email}
              </p>
              <p>
                <span className="font-semibold">Dato:</span>{" "}
                {booking.date}
              </p>
              <p>
                <span className="font-semibold">Tid:</span>{" "}
                {booking.time}
              </p>
              <p>
                <span className="font-semibold">Mobil:</span>{" "}
                {booking.mobile}
              </p>

              <p className="mt-4 text-sm text-gray-500">
                Takk for din reservasjon! Du vil motta mer informasjon på e-post
                dersom det er aktuelt.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
