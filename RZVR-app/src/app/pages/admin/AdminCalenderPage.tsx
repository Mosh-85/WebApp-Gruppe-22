import React from "react";
import ReservationCalender from "../../components/ReservationCalender";

export default function AdminCalendarPage() {
  return (
    <main style={{ padding: 16 }}>
      <h1>Restaurant-kalender</h1>
      <p>Admin-kalender for reservasjoner</p>
      <ReservationCalender />
    </main>
  );
}
