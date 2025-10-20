import React, { useState } from "react"; 

export default function ReactEmail() {
const [open, setOpen] = useState(false);
const [to, setTo] = useState("");

const sendEmail = () => {
alert(`Vil du sende emailen til ${to}`);
setOpen(false);
};

return (
<div className="email-schema">
<p>Her kan du sende e-poster</p>
{!open ? (
<button onClick={() => setOpen(true)} className="button-email">Send</button>
) : (
<div className="email-style">
<input placeholder="Velg hvilken e-post du vil sende til" value={to} onChange={(e) => setTo(e.target.value)} className="email-sendto" />
<button onClick={sendEmail} className="button-emailstyle">Send e-post</button>
<button onClick={() => setOpen(false)} className="Ikke send"></button>
</div>
)}
</div>
);
}