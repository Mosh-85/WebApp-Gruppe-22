import QRCode from "react-qr-code";
import { toPng } from "html-to-image";
import { useRef } from "react";

interface QrPreviewProps {
  value: string;
  label?: string;       // 🧩 optional label like "Bord 004"
  filename?: string;    // download filename (defaults to "qr-code")
  showDownload?: boolean;
  size?: number;
}

export default function QrPreview({
  value,
  label,
  filename = "qr-code",
  showDownload = true,
  size = 180,
}: QrPreviewProps) {
  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!qrRef.current) return;

    try {
      const dataUrl = await toPng(qrRef.current, { cacheBust: true });
      const link = document.createElement("a");
      link.download = `${filename}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("QR download failed:", error);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      {/* 🏷️ Optional label (like "Bord 004") */}
      {label && (
        <h3 className="font-semibold text-gray-800 text-lg tracking-wide">
          {label}
        </h3>
      )}

      {/* QR rendering area */}
      <div ref={qrRef} className="bg-white p-4 rounded-2xl shadow-lg">
        <QRCode value={value} size={size} />
      </div>

      {/* Optional download button */}
      {showDownload && (
        <button
          onClick={handleDownload}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all duration-200 shadow"
        >
          Last ned QR
        </button>
      )}
    </div>
  );
}
