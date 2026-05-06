import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthLayout from "../layouts/AuthLayout.jsx";
import { api } from "../api/client.js";
import { useAuth } from "../hooks/useAuth.js";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setToken } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error("Passwords do not match");
    setLoading(true);
    try {
      const res = await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password
      });
      setToken(res.data?.token);
      toast.success("Account created");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create NexPay Account" subtitle="Start automating your reconciliation workflows">
      <form className="space-y-4" onSubmit={onSubmit}>
        {[
          ["name", "Full Name", "text"],
          ["email", "Email", "email"],
          ["password", "Password", "password"],
          ["confirmPassword", "Confirm Password", "password"]
        ].map(([key, label, type]) => (
          <input key={key} type={type} placeholder={label} value={form[key]} onChange={(e) => setForm((v) => ({ ...v, [key]: e.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm outline-none" />
        ))}
        <button disabled={loading} className="w-full rounded-xl bg-indigo-500 px-4 py-3 font-medium text-white disabled:opacity-60">{loading ? "Creating..." : "Create account"}</button>
      </form>
      <p className="mt-4 text-sm text-slate-400">Already have an account? <Link className="text-indigo-300" to="/login">Login</Link></p>
      <p className="mt-4 text-sm text-slate-400">Go Back? <Link className="text-indigo-300" to="/Home">Home</Link></p>
    </AuthLayout>
  );
}
