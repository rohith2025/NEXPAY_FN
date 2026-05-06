import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Plus,
  Search,
  X,
  XCircle
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../api/client.js";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import StatsCard from "../components/StatsCard.jsx";
import StatusPieChart from "../components/Charts/StatusPieChart.jsx";
import TrendLineChart from "../components/Charts/TrendLineChart.jsx";
import VolumeBarChart from "../components/Charts/VolumeBarChart.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="glass-panel h-28 animate-pulse rounded-2xl" />
        ))}
      </div>
      <div className="glass-panel h-80 animate-pulse rounded-2xl" />
      <div className="glass-panel h-96 animate-pulse rounded-2xl" />
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [eventForm, setEventForm] = useState({ name: "", description: "" });
  const [search, setSearch] = useState("");

  const fetchDashboardData = async () => {
    const [statsRes, eventsRes] = await Promise.all([
      api.get("/dashboard/stats"),
      api.get("/events")
    ]);
    setStats(statsRes.data || {});

    const eventList = Array.isArray(eventsRes.data) ? eventsRes.data : [];
    const withSummary = await Promise.all(
      eventList.map(async (evt) => {
        try {
          const sumRes = await api.get(`/events/${evt._id}/summary`);
          return { ...evt, summary: sumRes.data || {} };
        } catch {
          return { ...evt, summary: evt.summary || {} };
        }
      })
    );
    const sorted = withSummary.sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );
    setEvents(sorted);
  };

  useEffect(() => {
    (async () => {
      try {
        await fetchDashboardData();
      } catch {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const latestEvent = events[0];

  const filteredEvents = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return events;
    return events.filter((evt) => {
      const name = String(evt.name ?? "").toLowerCase();
      const description = String(evt.description ?? "").toLowerCase();
      const status = String(evt.status ?? "").toLowerCase();
      return name.includes(q) || description.includes(q) || status.includes(q);
    });
  }, [events, search]);

  const trend = useMemo(
    () =>
      (stats?.timeline || []).map((x, i) => ({
        name: x.label || `T${i + 1}`,
        value: x.value || 0
      })),
    [stats]
  );

  const bar = [
    { name: "Verified", value: stats?.verified || 0 },
    { name: "Partial", value: stats?.partial || 0 },
    { name: "Not Verified", value: stats?.notVerified || 0 },
    { name: "Suspicious", value: stats?.suspicious || 0 }
  ];

  const onCreateEvent = async (e) => {
    e.preventDefault();
    if (!eventForm.name.trim()) {
      toast.error("Event name is required");
      return;
    }
    setCreating(true);
    try {
      const res = await api.post("/events", {
        name: eventForm.name.trim(),
        description: eventForm.description.trim()
      });
      const created = res.data;
      if (!created?._id) throw new Error("Missing event id");
      toast.success("Event created successfully");
      setOpenCreate(false);
      setEventForm({ name: "", description: "" });
      navigate(`/events/${created._id}`);
    } catch {
      toast.error("Failed to create event");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-semibold text-white">Event Management Dashboard</h2>
          <p className="text-sm text-slate-400">
            Track verification lifecycle, open events, and manage workflows.
          </p>
        </div>
        <div className="flex w-full shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end lg:w-auto lg:max-w-xl">
          <label className="group relative block w-full sm:min-w-[220px] sm:flex-1 lg:max-w-xs">
            <span className="sr-only">Search events</span>
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors duration-200 group-focus-within:text-indigo-300"
              aria-hidden
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events…"
              autoComplete="off"
              className="w-full rounded-xl border border-slate-500/30 bg-slate-900/35 py-2.5 pl-10 pr-3 text-sm text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl outline-none transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-slate-500 focus:border-indigo-400/45 focus:bg-slate-900/50 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.22),inset_0_1px_0_rgba(255,255,255,0.08)]"
            />
          </label>
          <button
            type="button"
            onClick={() => setOpenCreate(true)}
            className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400 sm:w-auto"
          >
            <Plus size={16} />
            Create Event
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatsCard title="Total Events" value={stats?.totalEvents || 0} icon={Activity} />
        <StatsCard title="Verified" value={stats?.verified || 0} icon={CheckCircle2} tone="emerald" />
        <StatsCard title="Partial" value={stats?.partial || 0} icon={Clock3} tone="amber" />
        <StatsCard title="Not Verified" value={stats?.notVerified || 0} icon={XCircle} tone="rose" />
        <StatsCard title="Suspicious" value={stats?.suspicious || 0} icon={AlertTriangle} tone="purple" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <StatusPieChart stats={stats} />
        <TrendLineChart data={trend} />
        <VolumeBarChart data={bar} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-4">
        <div className="glass-panel rounded-2xl p-5 lg:col-span-3">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h3 className="text-lg font-semibold text-white">Your Events</h3>
            <p className="text-xs text-slate-400">{filteredEvents.length} total</p>
          </div>

          {filteredEvents.length === 0 ? (
            events.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center">
                <p className="text-sm text-slate-300">No events created yet.</p>
                <p className="mt-1 text-xs text-slate-500">
                  Create your first event to start upload and verification.
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center">
                <p className="text-sm text-slate-300">No matching events found</p>
                <p className="mt-1 text-xs text-slate-500">Try a different search term.</p>
              </div>
            )
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="px-3 py-3">Event</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Created</th>
                    <th className="px-3 py-3">Last Processed</th>
                    <th className="px-3 py-3">Total</th>
                    <th className="px-3 py-3">Verified</th>
                    <th className="px-3 py-3">Partial</th>
                    <th className="px-3 py-3">Not Verified</th>
                    <th className="px-3 py-3">Suspicious</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((evt, index) => {
                    const summary = evt.summary || {};
                    const total = summary.total ?? summary.totalTransactions ?? evt.totalTransactions ?? 0;
                    return (
                      <tr
                        key={evt._id || `${evt.name || "event"}-${index}`}
                        onClick={() => navigate(`/events/${evt._id}`)}
                        className="cursor-pointer border-t border-slate-800/80 transition hover:bg-indigo-500/10"
                      >
                        <td className="px-3 py-3">
                          <p className="font-medium text-white">{evt.name}</p>
                          {evt.description ? (
                            <p className="line-clamp-1 text-xs text-slate-400">{evt.description}</p>
                          ) : null}
                        </td>
                        <td className="px-3 py-3"><StatusBadge status={evt.status} /></td>
                        <td className="px-3 py-3 text-slate-300">
                          {evt.createdAt ? new Date(evt.createdAt).toLocaleDateString() : "-"}
                        </td>
                        <td className="px-3 py-3 text-slate-300">
                          {evt.lastProcessedAt
                            ? new Date(evt.lastProcessedAt).toLocaleString()
                            : (evt.completedAt ? new Date(evt.completedAt).toLocaleString() : "-")}
                        </td>
                        <td className="px-3 py-3">{total}</td>
                        <td className="px-3 py-3 text-emerald-300">{summary.verified || 0}</td>
                        <td className="px-3 py-3 text-amber-300">{summary.partial || 0}</td>
                        <td className="px-3 py-3 text-rose-300">{summary.notVerified || 0}</td>
                        <td className="px-3 py-3 text-purple-300">{summary.suspicious || 0}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="glass-panel rounded-2xl p-5">
          <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
          <div className="mt-4 grid gap-3">
            {latestEvent ? (
              <Link
                to={`/events/${latestEvent._id}`}
                className="rounded-lg bg-indigo-500/80 px-4 py-3 text-center font-medium text-white transition hover:bg-indigo-400/80"
              >
                Open Latest Event
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="cursor-not-allowed rounded-lg bg-slate-700/60 px-4 py-3 text-center font-medium text-slate-400"
              >
                Open Latest Event
              </button>
            )}
            <Link
              to="/profile"
              className="rounded-lg border border-slate-700 px-4 py-3 text-center transition hover:bg-slate-900/60"
            >
              View Profile
            </Link>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {openCreate ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={() => setOpenCreate(false)}
          >
            <motion.form
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 12, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={onCreateEvent}
              className="glass-panel w-full max-w-lg rounded-2xl p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-lg font-semibold text-white">Create Event</h4>
                <button
                  type="button"
                  onClick={() => setOpenCreate(false)}
                  className="rounded-md p-1 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-3">
                <input
                  value={eventForm.name}
                  onChange={(e) => setEventForm((v) => ({ ...v, name: e.target.value }))}
                  placeholder="Event Name"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm outline-none focus:border-indigo-400"
                />
                <textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm((v) => ({ ...v, description: e.target.value }))}
                  placeholder="Description (optional)"
                  rows={4}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm outline-none focus:border-indigo-400"
                />
              </div>
              <button
                type="submit"
                disabled={creating}
                className="mt-4 w-full rounded-xl bg-indigo-500 px-4 py-3 font-medium text-white disabled:opacity-60"
              >
                {creating ? "Creating..." : "Create Event"}
              </button>
            </motion.form>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </DashboardLayout>
  );
}
