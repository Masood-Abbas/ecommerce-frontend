import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";

import { selectIsAuthenticated } from "@/Redux/authSlice/authSlice";
import { Sidebar } from "@/components/admin/sidebar";
import { Topbar } from "@/components/admin/navbar";


const AdminLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const isAuth = useSelector(selectIsAuthenticated);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuth) return <Navigate to="/login" replace />;
  if (user?.role !== "admin") return <Navigate to="/" replace />;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
