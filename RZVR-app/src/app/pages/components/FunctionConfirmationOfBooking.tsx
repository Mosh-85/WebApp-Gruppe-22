import React, { useState } from "react";

export default function FunctionConfirmationOfBooking() {
const [state, setState] = useState<"pending" | "confirmed" | "cancelled">("pending");

const onDetails = () => {
if (state === "pending") setState("confirmed");
else if (state === "confirmed") setState("cancelled");
else setState("pending");
};

return (
<div className="booking-result">
<p>Detaljer om din booking</p>
<p className="booking-status">Booking informasjon: {state}</p>
<p className="booking-fetch">{state === "pending" && "Registrerer din booking..."}
{state === "confirmed" && "Bookingen din er nå registrert inn"}
{state === "cancelled" && "Avbestillingen av din booking er fullført"}
</p>
<button onClick={onDetails} className="booking-status">Trykk for å sjekke din booking</button>
</div>
);
}