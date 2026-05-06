import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import { api } from "../api/client.js";
import Loader from "../components/Loader.jsx";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    (async () => {
      const res = await api.get("/profile");
      setProfile(res.data || {});
    })();
  }, []);

  if (!profile) return <DashboardLayout><Loader text="Loading profile..." /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="glass-panel mx-auto max-w-2xl rounded-3xl p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/30 text-2xl font-bold text-white">
            {(profile?.name || "U").slice(0, 1).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white">{profile?.name || "User"}</h2>
            <p className="text-slate-400">{profile?.email}</p>
          </div>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-700 p-4">
            <p className="text-sm text-slate-400">Total Events</p>
            <p className="mt-2 text-2xl font-semibold">{profile?.totalEvents || 0}</p>
          </div>
          <div className="rounded-2xl border border-slate-700 p-4">
            <p className="text-sm text-slate-400">Joined Date</p>
            <p className="mt-2 text-lg font-semibold">{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "-"}</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
