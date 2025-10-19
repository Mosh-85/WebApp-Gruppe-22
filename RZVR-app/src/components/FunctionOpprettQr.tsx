import { useState } from "react";
import QRcode from 'qrcode.react';

export function FunctionOpprettQr({ bordId }: { bordId: string}) {
    const [ifQR, setIfQR] = useState(false);

    return (
        <div>
            <button onClick={() => setIfQR(!ifQR)} className="qrcode-text">Vis QR koden min</button>
            {ifQR && (
                <div className="qr-code">
                    <QRcode value={bordId} />
                    </div>
            )}
        </div>
    );
}