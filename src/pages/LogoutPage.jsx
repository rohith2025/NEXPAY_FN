import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export default function LogoutPage() {
  const navigate = useNavigate();
  const { setToken } = useAuth();

  useEffect(() => {
    setToken(null);
    const t = setTimeout(() => navigate("/login"), 3000);
    return () => clearTimeout(t);
  }, [navigate, setToken]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel rounded-3xl p-10 text-center">
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <CheckCircle2 className="mx-auto text-emerald-300" size={56} />
        </motion.div>
        <h1 className="mt-4 text-2xl font-semibold text-white">You have successfully logged out</h1>
        <p className="mt-2 text-slate-400">Redirecting to login in 3 seconds...</p>
      </motion.div>
    </div>
  );
}
