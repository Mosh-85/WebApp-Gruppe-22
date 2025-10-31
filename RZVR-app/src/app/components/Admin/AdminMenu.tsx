const adminMenuItems = [
  { href: "/", label: "Tillbake", color: "gray" },
  { href: "/admin/reservations", label: "Reservasjoner", color: "blue" },
  { href: "/admin/kalender", label: "Kalender", color: "blue" },
  { href: "/admin/settings", label: "Instillinger", color: "blue" },
  { href: "/admin/qr-code", label: "Skann QR-kode", color: "blue" },
];

const getButtonClasses = (color: string) => {
  const baseClasses =
    "block w-full text-white font-medium py-3 px-6 rounded-md transition-colors duration-200 text-center";
  const colorClasses = {
    gray: "bg-gray-500 hover:bg-gray-600",
    blue: "bg-blue-500 hover:bg-blue-600",
  };
  return `${baseClasses} ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue}`;
};

function route(path: string, handler: any) {
  return { path, handler };
}

export default function AdminMenu() {
  return (
    <nav className="min-h-screen bg-gray-50 py-12 px-4">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">Admin Page</h1>
      <ul className="max-w-2xl mx-auto space-y-4">
        {adminMenuItems.map((item, index) => (
          <li key={index}>
            <button className={getButtonClasses(item.color)} onClick={(event) => { event?.preventDefault(); window.location.href = item.href; }}>{item.label}</button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

