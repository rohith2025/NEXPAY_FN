import { motion } from "framer-motion";

export default function StatsCard({ title, value, icon: Icon, tone = "indigo" }) {
  const toneClass = {
    indigo: "border-indigo-400/20",
    emerald: "border-emerald-400/20",
    amber: "border-amber-400/20",
    rose: "border-rose-400/20",
    purple: "border-purple-400/20"
  }[tone] || "border-indigo-400/20";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-panel rounded-2xl border p-5 ${toneClass}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{title}</p>
        {Icon ? <Icon size={16} className="text-slate-300" /> : null}
      </div>
      <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
    </motion.div>
  );
}
