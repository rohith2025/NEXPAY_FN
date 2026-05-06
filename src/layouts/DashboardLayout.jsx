import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import { useAuth } from "../hooks/useAuth.js";

export default function DashboardLayout({ children }) {
  const { logout } = useAuth();
  return (
    <div className="min-h-screen bg-transparent">
      <Sidebar onLogout={logout} />
      <div className="lg:ml-72">
        <Navbar />
        <main className="px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
