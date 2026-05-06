import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/api.js";

function eventStatusBadge(status) {
  switch (status) {
    case "pending":
      return "bg-slate-100 text-slate-700";
    case "processing":
      return "bg-amber-50 text-amber-800";
    case "completed":
      return "bg-emerald-50 text-emerald-700";
    case "failed":
      return "bg-rose-50 text-rose-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function statusBadge(status) {
  switch (status) {
    case "Verified":
      return "bg-emerald-50 text-emerald-700";
    case "Partially Matched":
      return "bg-amber-50 text-amber-800";
    case "Suspicious":
      return "bg-purple-50 text-purple-700";
    default:
      return "bg-rose-50 text-rose-700";
  }
}

function statusExplanation(status) {
  switch (status) {
    case "Verified":
      return "Exact match found using UTR and amount.";
    case "Partially Matched":
      return "Partial match based on amount or similarity. Manual verification recommended.";
    case "Not Verified":
      return "No matching transaction found.";
    case "Suspicious":
      return "Duplicate or abnormal transaction detected.";
    default:
      return "";
  }
}

function MatchRow({ label, ok }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-600">{label}</span>
      <span className="font-medium text-slate-900">
        {ok ? "✔ Yes" : "❌ No"}
      </span>
    </div>
  );
}

export default function EventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useMemo(() => localStorage.getItem("token"), []);

  const [payerFile, setPayerFile] = useState(null);
  const [bankFile, setBankFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [event, setEvent] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(true);

  const [rows, setRows] = useState([]);
  const [loadingRows, setLoadingRows] = useState(true);

  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(true);

  const [selectedTxn, setSelectedTxn] = useState(null);

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  const fetchEvent = async () => {
    setLoadingEvent(true);
    try {
      const res = await api.get(`/events/${id}`);
      setEvent(res.data ?? null);
      return res.data ?? null;
    } catch (err) {
      console.log(err);
      setEvent(null);
      return null;
    } finally {
      setLoadingEvent(false);
    }
  };

  const fetchRows = async () => {
    setLoadingRows(true);
    try {
      const res = await api.get(`/event/${id}`);
      setRows(res.data ?? []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingRows(false);
    }
  };

  const fetchSummary = async () => {
    setLoadingSummary(true);
    try {
      const res = await api.get(`/events/${id}/summary`);
      setSummary(res.data ?? null);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingSummary(false);
    }
  };

  const refreshAll = async () => {
    await Promise.all([fetchRows(), fetchSummary()]);
  };

  useEffect(() => {
    fetchEvent();
    refreshAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (event?.status !== "processing") return;

    const interval = setInterval(async () => {
      const latest = await fetchEvent();
      if (latest?.status === "completed" || latest?.status === "failed") {
        await refreshAll();
        clearInterval(interval);
      }
    }, 4000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event?.status, id]);

  // If backend updates status after uploads, ensure UI stays synced.
  useEffect(() => {
    if (!event?.status) return;
    // When status flips to completed, make sure we show latest data.
    if (event.status === "completed") refreshAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event?.status]);

  const onUpload = async (e) => {
    e.preventDefault();
    if (!payerFile || !bankFile) return;

    setUploading(true);
    try {
      const form = new FormData();
      form.append("payer", payerFile);
      form.append("bank", bankFile);
      form.append("eventId", id);

      await api.post("/upload", form, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setPayerFile(null);
      setBankFile(null);
      await fetchEvent();
    } catch (err) {
      console.log(err);
    } finally {
      setUploading(false);
    }
  };

  const analysis = selectedTxn?.analysis;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Event Details
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Upload payer + bank files to verify transactions.
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-slate-500">Status</span>
            <span
              className={[
                "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                eventStatusBadge(event?.status)
              ].join(" ")}
            >
              {loadingEvent ? "Loading..." : (event?.status ?? "pending")}
            </span>
          </div>
        </div>
        <Link
          to="/dashboard"
          className="rounded-md border px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Back
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-lg border bg-white p-5 shadow-sm lg:col-span-2">
          <div className="text-sm font-semibold text-slate-900">Upload</div>

          {event?.status === "processing" && (
            <div className="mt-3 flex items-center gap-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
              <div>Processing your data...</div>
            </div>
          )}

          <form onSubmit={onUpload} className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Payer file
                </label>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={(e) => setPayerFile(e.target.files?.[0] ?? null)}
                  className="mt-1 w-full rounded-md border bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Bank file
                </label>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={(e) => setBankFile(e.target.files?.[0] ?? null)}
                  className="mt-1 w-full rounded-md border bg-white px-3 py-2 text-sm"
                />
              </div>
            </div>

            <button
              disabled={
                uploading ||
                event?.status === "processing" ||
                !payerFile ||
                !bankFile
              }
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
              type="submit"
            >
              {event?.status === "processing"
                ? "Processing..."
                : (uploading ? "Uploading..." : "Upload & Verify")}
            </button>
          </form>
        </div>

        <div className="rounded-lg border bg-white p-5 shadow-sm">
          <div className="text-sm font-semibold text-slate-900">Summary</div>
          <div className="mt-4 space-y-2 text-sm">
            {loadingSummary ? (
              <div className="text-slate-700">Loading summary...</div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Total</span>
                  <span className="font-semibold text-slate-900">
                    {summary?.total ?? 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Verified</span>
                  <span className="font-semibold text-emerald-700">
                    {summary?.verified ?? 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Partial</span>
                  <span className="font-semibold text-amber-800">
                    {summary?.partial ?? 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Suspicious</span>
                  <span className="font-semibold text-purple-700">
                    {summary?.suspicious ?? 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Not Verified</span>
                  <span className="font-semibold text-rose-700">
                    {summary?.notVerified ?? 0}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg border bg-white shadow-sm">
        <div className="border-b px-5 py-3">
          <div className="text-sm font-semibold text-slate-900">
            Transactions
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Click a row for detailed analysis.
          </p>
        </div>

        {loadingRows ? (
          <div className="p-5 text-slate-700">Loading transactions...</div>
        ) : rows.length === 0 ? (
          <div className="p-5 text-slate-700">
            No transactions found for this event yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-600">
                <tr>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">UTR</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {rows.map((r) => (
                  <tr
                    key={r._id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedTxn(r)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedTxn(r);
                      }
                    }}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <td className="px-5 py-3 font-medium text-slate-900">
                      {r.name ?? "-"}
                    </td>
                    <td className="px-5 py-3 text-slate-700">
                      {r.utr ?? "-"}
                    </td>
                    <td className="px-5 py-3 text-slate-700">
                      {typeof r.amount === "number"
                        ? r.amount
                        : (r.amount ?? "-")}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={[
                          "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                          statusBadge(r.status)
                        ].join(" ")}
                      >
                        {r.status ?? "Not Verified"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-700">
                      {r.reason ?? "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedTxn && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="presentation"
          onClick={() => setSelectedTxn(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="txn-detail-title"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg border bg-white shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b px-5 py-4">
              <h2
                id="txn-detail-title"
                className="text-lg font-semibold text-slate-900"
              >
                Transaction analysis
              </h2>
              <button
                type="button"
                onClick={() => setSelectedTxn(null)}
                className="rounded-md px-2 py-1 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
            </div>

            <div className="space-y-4 px-5 py-4 text-sm">
              <div className="grid gap-2">
                <div>
                  <span className="text-slate-500">Name</span>
                  <div className="font-medium text-slate-900">
                    {selectedTxn.name ?? "-"}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">UTR</span>
                  <div className="font-medium text-slate-900">
                    {selectedTxn.utr ?? "-"}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">Amount</span>
                  <div className="font-medium text-slate-900">
                    {typeof selectedTxn.amount === "number"
                      ? selectedTxn.amount
                      : (selectedTxn.amount ?? "-")}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">Status</span>
                  <div className="mt-1">
                    <span
                      className={[
                        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                        statusBadge(selectedTxn.status)
                      ].join(" ")}
                    >
                      {selectedTxn.status ?? "Not Verified"}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">Reason</span>
                  <div className="font-medium text-slate-900">
                    {selectedTxn.reason ?? "-"}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">Match score</span>
                  <div className="font-medium text-slate-900">
                    {selectedTxn.matchScore != null
                      ? `${selectedTxn.matchScore}`
                      : "—"}
                  </div>
                </div>
              </div>

              <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Analysis breakdown
                </div>
                {analysis ? (
                  <div className="mt-3 space-y-2">
                    <MatchRow label="UTR match" ok={analysis.utrMatch} />
                    <MatchRow label="Amount match" ok={analysis.amountMatch} />
                    <MatchRow label="Name match" ok={analysis.nameMatch} />
                    <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-sm">
                      <span className="text-slate-600">
                        Confidence score
                      </span>
                      <span className="font-semibold text-slate-900">
                        {analysis.confidence ?? selectedTxn.matchScore ?? 0}%
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="mt-2 text-slate-600">
                    No stored analysis for this record (upload again to refresh).
                  </p>
                )}
              </div>

              <div className="rounded-md border border-slate-200 bg-white p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Explanation
                </div>
                <p className="mt-2 text-slate-700">
                  {statusExplanation(selectedTxn.status)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
