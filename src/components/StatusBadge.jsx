const statusStyles = {
  verified:
    "bg-emerald-500/20 text-emerald-200 border-emerald-400/40 shadow-[0_0_12px_rgba(16,185,129,0.35)]",
  "partially matched":
    "bg-amber-500/20 text-amber-200 border-amber-400/40 shadow-[0_0_12px_rgba(245,158,11,0.35)]",
  "not verified":
    "bg-rose-500/20 text-rose-200 border-rose-400/40 shadow-[0_0_12px_rgba(244,63,94,0.35)]",
  suspicious:
    "bg-purple-500/20 text-purple-200 border-purple-400/40 shadow-[0_0_12px_rgba(168,85,247,0.35)]",
  processing:
    "bg-amber-500/20 text-amber-200 border-amber-400/40 shadow-[0_0_12px_rgba(245,158,11,0.35)]",
  pending:
    "bg-slate-500/20 text-slate-200 border-slate-400/40 shadow-[0_0_12px_rgba(148,163,184,0.25)]",
  completed:
    "bg-emerald-500/20 text-emerald-200 border-emerald-400/40 shadow-[0_0_12px_rgba(16,185,129,0.35)]",
  failed:
    "bg-rose-500/20 text-rose-200 border-rose-400/40 shadow-[0_0_12px_rgba(244,63,94,0.35)]"
};

export default function StatusBadge({ status }) {
  const normalized = String(status || "pending").toLowerCase();
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyles[normalized] || statusStyles.pending}`}
    >
      {status || "pending"}
    </span>
  );
}
