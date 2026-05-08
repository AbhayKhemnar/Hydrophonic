import { NavLink, Outlet } from "react-router-dom";
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

const roleLabel = {
  admin: "Admin Control",
  farmer: "Farm Operations",
  trader: "Trader Workspace",
  consumer: "Local Buyer View"
};

function DashboardLayout() {
  const { user, logout } = useAuth();
  const links = linksByRole[user.role] || [];

  return (
    <div className="min-h-screen bg-transparent">
      <header className="border-b border-white/60 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-5 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">
                Hydroponic Platform
              </p>
              <h1 className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl">{user.name}</h1>
              <p className="mt-1 text-sm text-slate-500">{roleLabel[user.role] || "Workspace"}</p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center justify-center rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-900 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50"
            >
              Logout
            </button>
          </div>

          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:hidden">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? "bg-emerald-700 text-white shadow-sm"
                      : "bg-emerald-50 text-emerald-900 hover:bg-emerald-100"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-5 lg:grid-cols-[250px_1fr] lg:px-8 lg:py-8">
        <aside className="hidden rounded-3xl border border-white/70 bg-white/85 p-5 shadow-[0_20px_45px_-28px_rgba(15,23,42,0.45)] backdrop-blur lg:block">
          <div className="rounded-2xl bg-emerald-950 p-4 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
              {user.role}
            </p>
            <p className="mt-2 text-lg font-semibold">{roleLabel[user.role] || "Workspace"}</p>
            <p className="mt-2 text-sm text-slate-300">
              Monitor operations, act quickly, and keep your farm moving.
            </p>
          </div>
          <nav className="mt-5 space-y-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `block rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                    ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100"
                    : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-900"
                  }`
                }
              >
                {link.label}
              </NavLink>
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
