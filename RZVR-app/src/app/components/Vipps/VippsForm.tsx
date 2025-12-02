"use client";
import React, { useEffect, useState } from "react";

type VippsFormProps = {
  booking?: Record<string, string> | null;
};

export default function VippsForm({ booking }: VippsFormProps) {
  const [mobile, setMobile] = useState("");
  const isValid = mobile.replace(/\D/g, "").length >= 8;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(5);

  // 
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (isSubmitting) return;

  const digits = mobile.replace(/\D/g, "");
  if (digits.length < 8) {
    const el = document.querySelector('input[type="tel"]') as HTMLInputElement | null;
    el?.focus();
    return;
  }

  // Start "betalingsanimasjon"
  setIsSubmitting(true);
  setCountdown(5);

  // NYTT: send booking til backend slik at den dukker opp i admin-kalenderen
  if (booking) {
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: booking.fullName,
          people: booking.people,
          email: booking.email,
          date: booking.date,
          time: booking.time,
          mobile: digits,
        }),
      });

      if (!res.ok) {
        console.error("Feil ved lagring av booking:", await res.text());
      }
    } catch (err) {
      console.error("Nettverksfeil ved lagring av booking:", err);
    }
  } else {
    console.warn("Ingen booking-data tilgjengelig i VippsForm");
  }
};

  useEffect(() => {
    if (!isSubmitting) return;

    const timerId = window.setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          window.clearInterval(timerId);

          // 🔽 Build URL with booking data + mobile
          const params = new URLSearchParams();

          if (booking) {
            Object.entries(booking).forEach(([key, value]) => {
              if (typeof value === "string") {
                params.set(key, value);
              }
            });
          }

          if (mobile) {
            params.set("mobile", mobile.replace(/\D/g, ""));
          }

          const query = params.toString();
          window.location.href = query
            ? `/booking-info?${query}`
            : "/booking-info";

          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [isSubmitting, booking, mobile]);

  if (isSubmitting) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="w-full max-w-md p-8 bg-white rounded-xl shadow text-center">
          <h2 className="text-2xl font-bold mb-2">Godkjent</h2>
          <p className="mb-4">
            Din betaling er bekreftet. Vi videresender til booking-bekreftelsen om
          </p>
          <div className="text-4xl font-mono">{countdown}s</div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <h2>Bekrefte med Vipps</h2>
        <input
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          placeholder="Mobilnummer"
          required
          className="w-full p-2 border rounded"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className={`mt-4 w-full p-2 text-white rounded ${
            !isValid || isSubmitting
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-green-500 hover:brightness-90"
          }`}
        >
          Bekrefte med Vipps
        </button>
      </form>
    </main>
  );
}
