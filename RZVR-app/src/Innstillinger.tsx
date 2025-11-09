import React from "react";
import "./Innstillinger.css";

export default function Innstillinger() {
    return (
        <div className="admin-page">
            <h1 className="admin-header">Innstillinger</h1>
        
        <div className="admin-card">
            <h2 className="admin-title">Admin</h2>
        
        <div className="admin-buttons">
            <button className="admin-btn">Opprett bord</button>
            <button className="admin-btn">Opprett profil</button>
        </div>
        </div>
        </div>
    )
}