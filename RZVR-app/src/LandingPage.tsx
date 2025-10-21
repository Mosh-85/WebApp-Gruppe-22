import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        navn: '',
        dato: '',
        antall: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch('/api/booking', {
            method: 'POST',
            body: JSON.stringify(formData),  
        });
        navigate('/vipps');
    };

    return (
        <div className="book">
            <p className="booking-text">Booking av bord</p>
            <form onSubmit={handleSubmit} className="form-schema">
                <input placeholder="name" onChange={(e) => setFormData({ ...formData, navn: e.target.value })} />
                <input type="date" onChange={(e) => setFormData({ ...formData, dato: e.target.value })} />
                <input placeholder="Hvor mange personer?" type="number" onChange={(e) => setFormData({ ...formData, antall: e.target.value })} />
                <button className="send-booking" type="submit">Ok</button>
            </form>
        </div>
    );
}

export default LandingPage;