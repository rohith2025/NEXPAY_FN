import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthLayout from "../layouts/AuthLayout.jsx";
import { api } from "../api/client.js";
import { useAuth } from "../hooks/useAuth.js";

export default function LoginPage() {
  const [showPwd, setShowPwd] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setToken } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error("All fields are required");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      setToken(res.data?.token);
      toast.success("Logged in successfully");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your NexPay workspace">
      <form className="space-y-4" onSubmit={onSubmit}>
        <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((v) => ({ ...v, email: e.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm outline-none" />
        <div className="relative">
          <input type={showPwd ? "text" : "password"} placeholder="Password" value={form.password} onChange={(e) => setForm((v) => ({ ...v, password: e.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 pr-11 text-sm outline-none" />
          <button type="button" onClick={() => setShowPwd((v) => !v)} className="absolute right-3 top-3 text-slate-400">{showPwd ? <EyeOff size={18} /> : <Eye size={18} />}</button>
        </div>
        <button disabled={loading} className="w-full rounded-xl bg-indigo-500 px-4 py-3 font-medium text-white disabled:opacity-60">{loading ? "Signing in..." : "Login"}</button>
      </form>
      <p className="mt-4 text-sm text-slate-400">No account? <Link className="text-indigo-300" to="/register">Create one</Link></p>
       <p className="mt-4 text-sm text-slate-400">Go Back? <Link className="text-indigo-300" to="/Home">Home</Link></p>
    </AuthLayout>
  );
}
