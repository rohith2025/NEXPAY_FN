import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import StatusBadge from "./StatusBadge.jsx";

export default function TransactionTable({ rows, onRowClick, onExport }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("name");
  const pageSize = 8;

  const filtered = useMemo(() => {
    return rows
      .filter((r) => {
        const q = query.toLowerCase();
        const matchesSearch =
          !q ||
          [r.name, r.email, r.utr]
            .filter(Boolean)
            .some((v) => v.toLowerCase().includes(q));
        const matchesStatus = status === "all" || r.status === status;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => String(a[sortBy] || "").localeCompare(String(b[sortBy] || "")));
  }, [rows, query, status, sortBy]);

  const renderMailStatus = (row) => {
    if (row.mailSent) return <span className="text-emerald-300">Sent</span>;
    if (row.mailError) return <span className="text-rose-300">Failed</span>;
    return <span className="text-amber-300">Pending</span>;
  };

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="glass-panel rounded-2xl p-4">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name/email/utr" className="rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm">
          <option value="all">All</option>
          <option value="Verified">Verified</option>
          <option value="Partially Matched">Partial</option>
          <option value="Not Verified">Not Verified</option>
          <option value="Suspicious">Suspicious</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm">
          <option value="name">Sort by Name</option>
          <option value="amount">Sort by Amount</option>
          <option value="matchScore">Sort by Score</option>
        </select>
        <button type="button" onClick={onExport} className="ml-auto inline-flex items-center gap-2 rounded-lg bg-indigo-500/80 px-4 py-2 text-sm font-medium text-white">
          <Download size={14} /> Download CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-xs uppercase text-slate-400">
            <tr>
              {["name", "email", "utr", "amount", "status", "match score", "mail sent", "actions"].map((th) => (
                <th key={th} className="px-3 py-3">{th}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((row, index) => (
              <tr key={row._id || `${row.utr || "txn"}-${index}`} className="cursor-pointer border-t border-slate-800 hover:bg-slate-900/50" onClick={() => onRowClick(row)}>
                <td className="px-3 py-3">{row.name || "-"}</td>
                <td className="px-3 py-3">{row.email || "-"}</td>
                <td className="px-3 py-3">{row.utr || "-"}</td>
                <td className="px-3 py-3">{row.amount || "-"}</td>
                <td className="px-3 py-3"><StatusBadge status={row.status} /></td>
                <td className="px-3 py-3">{row.matchScore ?? 0}%</td>
                <td className="px-3 py-3">{renderMailStatus(row)}</td>
                <td className="px-3 py-3 text-indigo-300">View</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center justify-end gap-2">
        <button type="button" disabled={page === 1} onClick={() => setPage((v) => Math.max(1, v - 1))} className="rounded border border-slate-700 px-3 py-1 text-xs">Prev</button>
        <span className="text-xs text-slate-400">Page {page} / {totalPages}</span>
        <button type="button" disabled={page === totalPages} onClick={() => setPage((v) => Math.min(totalPages, v + 1))} className="rounded border border-slate-700 px-3 py-1 text-xs">Next</button>
      </div>
    </div>
  );
}
