import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const linksByRole = {
  admin: [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/market", label: "Market" },
    { to: "/complaints", label: "Complaints" }
  ],
  farmer: [
    { to: "/farmer/dashboard", label: "Dashboard" },
    { to: "/farmer/iot", label: "IoT" },
    { to: "/farmer/ai", label: "AI" },
    { to: "/farmer/market", label: "Market" },
    { to: "/complaints", label: "Complaints" }
  ],
  trader: [
    { to: "/trader/dashboard", label: "Dashboard" },
    { to: "/trader/market", label: "Market" },
    { to: "/complaints", label: "Complaints" }
  ],
  consumer: [
    { to: "/consumer/dashboard", label: "Dashboard" },
    { to: "/consumer/market", label: "Market" },
    { to: "/complaints", label: "Complaints" }
  ]
};

function DashboardLayout() {
  const { user, logout } = useAuth();
  const links = linksByRole[user.role] || [];

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
              Hydroponic Platform
            </p>
            <h1 className="text-xl font-bold text-slate-950">{user.name}</h1>
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-6 lg:grid-cols-[220px_1fr] lg:px-8">
        <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {user.role}
          </p>
          <nav className="mt-4 space-y-2">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="space-y-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
