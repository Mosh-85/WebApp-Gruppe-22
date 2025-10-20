import React from 'react';

export default function AdminNav() {
    return (
        <nav  >
            <ul className="space-y-4" >
                <li className="w-full p-2 border rounded" ><button>Reservasjoner</button></li>
                <li className="w-full p-2 border rounded"><button>Kalender</button></li>
                <li className="w-full p-2 border rounded"><button>Innstillinger</button></li>
                <li className="w-full p-2 border rounded"><button>Scann QR-kode</button></li>
            </ul>
        </nav>
    )
}