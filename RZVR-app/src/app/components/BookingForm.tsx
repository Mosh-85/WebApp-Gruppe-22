import React, { useRef } from "react";

type BookingFormProps = {
    onSubmit: (data: Record<string, string>) => void;
};

export default function BookingForm({ onSubmit }: BookingFormProps) {
    const formRef = useRef<HTMLFormElement | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const form = formRef.current;
        if (!form) return;

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const fd = new FormData(form);
        const data = Object.fromEntries(fd.entries()) as Record<string, string>;
        onSubmit(data);
    };

    return (
        <form ref={formRef} className="space-y-4" onSubmit={handleSubmit}>
            <input type="text" name="fullName" placeholder="For og etternavn" required className="w-full p-2 border rounded" />
            <input type="number" name="people" placeholder="Antal personer" min={1} required className="w-full p-2 border rounded" />
            <input type="email" name="email" placeholder="E-post" required className="w-full p-2 border rounded" />
            <input type="time" title="Velg tid" name="time" id="time" required className="w-full p-2 border rounded" />
            <input type="date" title="Velg dato" name="date" required className="w-full p-2 border rounded" />
            <button type="submit" className="mt-4 w-full p-2 bg-blue-500 text-white rounded">Send booking</button>
        </form>
    );
}