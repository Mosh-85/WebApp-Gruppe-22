import React from "react";

export default function BookingForm() {
    return (
        <form className="space-y-4">
            <h2>Booking Form</h2>
            <input type="text" name="fullName" placeholder="Full Name" required className="w-full p-2 border rounded" />
            <input type="number" name="people" min={1} required className="w-full p-2 border rounded" />
            <input type="email" name="email" placeholder="Email" required className="w-full p-2 border rounded" />
            <input type="time" name="time" id="time" required className="w-full p-2 border rounded" />
            <input type="date" name="date" required className="w-full p-2 border rounded" />
            <button type="submit" className="mt-4 w-full p-2 bg-blue-500 text-white rounded">Book Now</button>
        </form>
    );
}