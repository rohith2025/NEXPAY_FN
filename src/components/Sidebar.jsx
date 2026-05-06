import { BarChart3, CircleUser, House, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/dashboard", icon: House, label: "Dashboard" },
  // { to: "/dashboard", icon: BarChart3, label: "Events" },
  { to: "/profile", icon: CircleUser, label: "Profile" }
];

export default function Sidebar({ onLogout }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed left-4 top-4 z-40 rounded-lg border border-slate-700 bg-slate-900/90 p-2 text-slate-200 lg:hidden"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      <aside
        className={`glass-panel fixed inset-y-0 left-0 z-30 w-72 transform border-r border-slate-700/40 p-5 transition lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="mt-12 lg:mt-2">
          <h1 className="text-2xl font-bold text-white">NexPay</h1>
          <p className="text-xs text-slate-400">Fintech Verification Suite</p>
        </div>

        <nav className="mt-8 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                  isActive
                    ? "bg-indigo-500/20 text-indigo-200"
                    : "text-slate-300 hover:bg-slate-800/70"
                }`
              }
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={onLogout}
          className="mt-8 flex w-full items-center gap-3 rounded-xl bg-rose-500/15 px-4 py-3 text-sm text-rose-200 hover:bg-rose-500/25"
        >
          <LogOut size={16} />
          Logout
        </button>
      </aside>
    </>
  );
}
