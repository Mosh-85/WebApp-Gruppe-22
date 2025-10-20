import { useState } from "react";
import QRcode from 'qrcode.react';

export function FunctionOpprettQr({ bordId }: { bordId: string}) {
    const [ifQR, setIfQR] = useState(false);

    return (
        <div>
            <button onClick={() => setIfQR(!ifQR)} className="qrcode-text">               
{ifQR ? "Ikke vis QR-koden" : "Vis QR-koden"}
</button>
{ifQR && (
<div className="qr-styling">
<QRcode value={bordId}
size={300}
bgColor="#cccccc"
fgColor="0000000"
includeMargin={true}
level="H"
/>
</div>
)}
</div>
);
}