import { Button } from "@/components/ui/button";
import { logout } from "@/Redux/authSlice/authSlice";
import { User, Package, LogOut, Store } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import LogoutPopup from "../popup/LogoutPopUp";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ activeTab, setActiveTab, profile }) {
  const role = useSelector((state) => state.auth.user.role);
  const [logoutPopup, setLogoutPopup] = useState(false);
  const navigate = useNavigate();

  const handleLogoutConfirm = () => {
    setLogoutPopup(false);
    dispatch(logout());
    navigate("/login");
  };
  const menuItem = (id, label, Icon) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition
        ${
          activeTab === id
            ? "bg-gray-100 text-(--primary-color) font-medium"
            : "text-gray-700 hover:bg-gray-100"
        }
      `}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  return (
    <>
      <aside className="lg:sticky lg:top-24  col-span-12 md:col-span-3 bg-white shadow-md rounded-2xl p-6 h-fit space-y-6">
        {/* PROFILE SECTION */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            {profile.name || "User"}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Welcome to your dashboard
          </p>
        </div>

        {/* ACCOUNT SECTION */}
        <div className="space-y-2">
          {menuItem("profile", "My Profile", User)}
        </div>

        <div className="space-y-2">
          {menuItem("orders", "My Orders", Package)}
        </div>

        {/* SELLER SECTION */}
        {role === "vendor" ? (
          <div className="space-y-2 w-full">
            <Button
              className="text-gray-600 bg-transparent hover:bg-gray-100  text-sm w-full flex justify-start "
              onClick={(e) => {
                e.stopPropagation();
                navigate("/vendorDashboards");
              }}
            >
              <Store size={18} /> Go to vendor dashboard
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {menuItem("seller", "Become a Seller", Store)}
          </div>
        )}

        {/* LOGOUT */}
        <div className="border-t pt-4">
          <Button
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition text-white bg-(--primary-color) hover:bg-(--hover-primary-color)"
            onClick={() => setLogoutPopup(true)}
          >
            <LogOut size={18} />
            Logout
          </Button>
        </div>
      </aside>
      <LogoutPopup
        open={logoutPopup}
        onCancel={() => setLogoutPopup(false)}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
}
