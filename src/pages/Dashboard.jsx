import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api.js";

export default function Dashboard() {
  const navigate = useNavigate();
  const token = useMemo(() => localStorage.getItem("token"), []);
  const [events, setEvents] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get("/events");
      setEvents(res.data ?? []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    try {
      await api.post("/events", { name: name.trim() });
      setName("");
      await fetchEvents();
    } catch (err) {
      console.log(err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">
            Create an event, upload files, and verify transactions.
          </p>
        </div>

        <form
          onSubmit={onCreate}
          className="flex w-full max-w-xl gap-2 md:justify-end"
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="New event name"
            className="w-full rounded-md border px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-slate-900"
          />
          <button
            disabled={creating}
            className="shrink-0 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
            type="submit"
          >
            {creating ? "Creating..." : "Create"}
          </button>
        </form>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="rounded-lg border bg-white p-6 text-slate-700">
            Loading events...
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-lg border bg-white p-6 text-slate-700">
            No events yet. Create your first event above.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((ev) => (
              <button
                key={ev._id}
                onClick={() => navigate(`/event/${ev._id}`)}
                className="text-left"
              >
                <div className="rounded-lg border bg-white p-5 shadow-sm hover:bg-slate-50">
                  <div className="text-lg font-semibold text-slate-900">
                    {ev.name}
                  </div>
                  <div className="mt-2 text-xs text-slate-500">
                    Created:{" "}
                    {ev.createdAt ? new Date(ev.createdAt).toLocaleString() : "-"}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

