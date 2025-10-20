import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FunctionLeggTilBooking() {
const navigate = useNavigate();
const [form, setForm] = useState({
name: "",
email: "", 
guests: "",
date: "",
time: "",
});
const [message, setMessage] = useState(""); 

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
setForm({ ...form, [e.target.name]: e.target.value });
};

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();
try {
    await fetch("/api/booking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
});

setMessage("Bookingen er registrert"); 
setTimeout(() => navigate("/booking-info"), 1000);
} catch (error) {
setMessage("En uventet feil gjorde at det ikke gikk å registrere bookingen");
console.error(error);
}
};

return (
<div className="booking-checking">
<p>Her skjer booking av bord</p>
<form onSubmit={handleSubmit} className="form-bookingcheck">
<input className="name-booking" name="name" placeholder="Navn" onChange={handleChange} />
<input className="epost-booking" name="email" placeholder="E-post" onChange={handleChange} />
<input className="guest-booking" name="guests" type="number" placeholder="Antall gjester" onChange={handleChange} />
<input className="date-booking" name="date" type="date" onChange={handleChange} />
<input className="time-booking" name="time" type="time" onChange={handleChange} />
<button type="submit" className="button-booking">Book nå</button>
</form>
{message && <p className="info-text">{message}</p>}
</div>
);
}