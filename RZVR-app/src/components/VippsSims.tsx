import { useState } from "react";

export function VippsSims() {
    const [payment, setPayment] = useState(false);

    const handlePayment = () => {
        setPayment(true);
    };

    return (
        <div className="payment-schema">
            <p className="payment-text">Betale med vipps</p>
            <input placeholder="Kontonummer" className="kontonummer" />
            <input placeholder="Kortets utløpsdato" className="utlopsdato" />
            <button onClick={handlePayment} className="payment-button">Betal nå</button>
            {payment && <p className="paid">Godkjent betaling</p>}
        </div>
    );
}