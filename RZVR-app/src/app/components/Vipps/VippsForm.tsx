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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;
        const digits = mobile.replace(/\D/g, "");
        if (digits.length >= 8) {
            setIsSubmitting(true);
            setCountdown(5);
        } else {
            const el = document.querySelector('input[type="tel"]') as HTMLInputElement | null;
            el?.focus();
        }
    };

    useEffect(() => {
        if (!isSubmitting) return;
        const timerId = window.setInterval(() => {
            setCountdown((c) => {
                if (c <= 1) {
                    window.clearInterval(timerId);
                    //dette er ikke riktig måte for å nivigere, kun for testing.
                    window.location.href = "/booking-info";
                    return 0;
                }
                return c - 1;
            });
        }, 1000);

        return () => window.clearInterval(timerId);
    }, [isSubmitting]);

    if (isSubmitting) {
        return (
            <main className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
                <div className="w-full max-w-md p-8 bg-white rounded-xl shadow text-center">
                    <h2 className="text-2xl font-bold mb-2">Godkjent</h2>
                    <p className="mb-4">Din betaling er bekreftet. Vi videresender til booking-bekreftelsen om</p>
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
                className={`mt-4 w-full p-2 text-white rounded ${(!isValid || isSubmitting) ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-500 hover:brightness-90'}`}>
                Bekrefte med Vipps
            </button>
        </form>
        </main>
    );
}