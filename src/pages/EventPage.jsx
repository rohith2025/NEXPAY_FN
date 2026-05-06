import { motion } from "framer-motion";
import { BarChart3, FileWarning, LoaderCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import { api } from "../api/client.js";
import Loader from "../components/Loader.jsx";
import UploadBox from "../components/UploadBox.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import TransactionTable from "../components/TransactionTable.jsx";
import TransactionModal from "../components/TransactionModal.jsx";
import StatusPieChart from "../components/Charts/StatusPieChart.jsx";
import VolumeBarChart from "../components/Charts/VolumeBarChart.jsx";
import StatsCard from "../components/StatsCard.jsx";

export default function EventPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState({});
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [payerFile, setPayerFile] = useState(null);
  const [bankFile, setBankFile] = useState(null);

  const fetchData = async () => {
    try {
      const detailsRes = await api.get(`/events/${id}/details`);
      setEvent(detailsRes.data?.event || {});
      setRows(Array.isArray(detailsRes.data?.transactions) ? detailsRes.data.transactions : []);
      setSummary(detailsRes.data?.summary || {});
    } catch {
      // Fallback for partial deployments where /details route may be unavailable.
      const [eventRes, txRes, summaryRes] = await Promise.allSettled([
        api.get(`/events/${id}`),
        api.get(`/events/${id}/transactions`),
        api.get(`/events/${id}/summary`)
      ]);
      if (eventRes.status === "fulfilled") {
        const payload = eventRes.value.data || {};
        setEvent(payload.event || payload);
        if (Array.isArray(payload.transactions) && payload.transactions.length > 0) {
          setRows(payload.transactions);
        }
        if (payload.analytics) {
          setSummary(payload.analytics);
        }
      } else {
        setEvent({});
      }
      if (txRes.status === "fulfilled" && Array.isArray(txRes.value.data)) {
        setRows(txRes.value.data);
      }
      if (summaryRes.status === "fulfilled") {
        setSummary(summaryRes.value.data || {});
      }
    }
  };

  useEffect(() => {
    (async () => {
      try {
        await fetchData();
      } catch {
        toast.error("Failed loading event");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    const normalized = String(event?.status || "").toLowerCase();
    if (normalized !== "processing") return undefined;
    const t = setInterval(fetchData, 3500);
    return () => clearInterval(t);
  }, [event?.status, id]);

  const onUpload = async () => {
    if (!payerFile || !bankFile) return toast.error("Upload both files");
    const form = new FormData();
    form.append("payer", payerFile);
    form.append("bank", bankFile);
    form.append("eventId", id);
    try {
      await api.post("/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          if (!e.total) return;
          setUploadProgress(Math.round((e.loaded / e.total) * 100));
        }
      });
      toast.success("Upload queued");
      await fetchData();
      setUploadProgress(0);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Upload failed");
    }
  };

  const onExport = async () => {
    try {
      const res = await api.get(`/events/${id}/export`, { responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `${event?.name || "event"}-report.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("CSV downloaded");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Export failed");
    }
  };

  const normalizedStatus = String(event?.status || "pending").toLowerCase();
  const isPending = normalizedStatus === "pending";
  const isProcessing = normalizedStatus === "processing";
  const isCompleted = normalizedStatus === "completed";
  const hasTransactions = rows.length > 0;
  const hasSummaryData = Number(summary?.total || summary?.totalTransactions || 0) > 0;
  const showCompletedResults = isCompleted && (hasTransactions || hasSummaryData);
  const showUploadState = isPending && !hasTransactions && !hasSummaryData;

  const barData = useMemo(
    () => [
      { name: "Verified", value: summary?.verified || 0 },
      { name: "Partial", value: summary?.partial || 0 },
      { name: "Not Verified", value: summary?.notVerified || 0 },
      { name: "Suspicious", value: summary?.suspicious || 0 }
    ],
    [summary]
  );

  if (loading) {
    return (
      <DashboardLayout>
        <Loader text="Loading event details..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-white">{event?.name || "Event"}</h2>
          <p className="text-sm text-slate-400">
            Upload files, track queue processing, and review verification results.
          </p>
        </div>
        <StatusBadge status={event?.status} />
      </div>

      <div className="glass-panel rounded-2xl p-5">
        <h3 className="text-lg font-semibold text-white">Upload & Verification</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <UploadBox
            label="Payer CSV"
            file={payerFile}
            onChange={(e) => setPayerFile(e.target.files?.[0] || null)}
          />
          <UploadBox
            label="Bank CSV"
            file={bankFile}
            onChange={(e) => setBankFile(e.target.files?.[0] || null)}
          />
        </div>
        <button
          type="button"
          onClick={onUpload}
          disabled={isProcessing}
          className="mt-4 rounded-xl bg-indigo-500 px-5 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isProcessing ? "Verification in progress..." : "Upload & Verify"}
        </button>
        {uploadProgress > 0 ? (
          <p className="mt-3 text-xs text-slate-400">Upload Progress: {uploadProgress}%</p>
        ) : null}
      </div>

      {isProcessing ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel mt-6 rounded-2xl p-8"
        >
          <div className="flex items-center gap-3">
            <LoaderCircle className="animate-spin text-indigo-300" />
            <p className="text-lg font-medium text-white">Verification in progress...</p>
          </div>
          <p className="mt-2 text-sm text-slate-400">
            Processing is running in queue. This page auto-refreshes until completion.
          </p>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div className="h-2 w-2/3 animate-pulse rounded-full bg-indigo-400" />
          </div>
        </motion.div>
      ) : null}

      {showUploadState ? (
        <div className="glass-panel mt-6 rounded-2xl p-8 text-center">
          <FileWarning className="mx-auto text-slate-400" size={30} />
          <p className="mt-3 text-lg font-medium text-white">No verification results yet</p>
          <p className="mt-1 text-sm text-slate-400">
            Upload payer and bank files to start verification for this event.
          </p>
        </div>
      ) : null}

      {!isProcessing && !showUploadState && !showCompletedResults ? (
        <div className="glass-panel mt-6 rounded-2xl p-8 text-center">
          <FileWarning className="mx-auto text-slate-400" size={30} />
          <p className="mt-3 text-lg font-medium text-white">No processed data available</p>
          <p className="mt-1 text-sm text-slate-400">
            This event has not produced saved transaction results yet.
          </p>
        </div>
      ) : null}

      {showCompletedResults ? (
        <>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatsCard title="Verified" value={summary?.verified || 0} tone="emerald" />
            <StatsCard title="Partial" value={summary?.partial || 0} tone="amber" />
            <StatsCard title="Not Verified" value={summary?.notVerified || 0} tone="rose" />
            <StatsCard title="Suspicious" value={summary?.suspicious || 0} tone="purple" />
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <StatusPieChart stats={summary} />
            <VolumeBarChart data={barData} />
            <div className="glass-panel rounded-2xl p-5">
              <div className="mb-3 flex items-center gap-2">
                <BarChart3 size={16} className="text-slate-300" />
                <h3 className="text-sm font-semibold text-slate-200">Status Distribution</h3>
              </div>
              <div className="space-y-3 text-sm">
                {barData.map((item, index) => (
                  <div key={`${item.name}-${index}`}>
                    <div className="mb-1 flex items-center justify-between text-slate-300">
                      <span>{item.name}</span>
                      <span>{item.value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800">
                      <div
                        className="h-2 rounded-full bg-indigo-400"
                        style={{
                          width: `${Math.min(
                            100,
                            (item.value /
                              Math.max(
                                1,
                                (summary?.total || summary?.totalTransactions || rows.length || 1)
                              )) *
                              100
                          )}%`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <TransactionTable rows={rows} onRowClick={setSelected} onExport={onExport} />
          </div>
        </>
      ) : null}

      <TransactionModal txn={selected} onClose={() => setSelected(null)} />
    </DashboardLayout>
  );
}
