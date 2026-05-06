import { Bell, Search, Database, Wallet } from "lucide-react";

export default function Navbar() {
  return (
    <header className="glass-panel sticky top-0 z-20 mx-4 mt-4 flex items-center justify-between rounded-2xl border border-slate-700/40 px-4 py-3 lg:mx-8">
      <div>
        <h2 className="text-lg font-semibold text-white">NexPay Control Center</h2>
        <p className="text-xs text-slate-400">Queue based verification analytics</p>
      </div>
      <div className="hidden items-center gap-3 md:flex">
        <button type="button" className="rounded-xl border border-slate-700 bg-slate-900/60 p-2">
        <Wallet size={18} className="text-blue-400" />
        </button>
      </div>
    </header>
  );
}
