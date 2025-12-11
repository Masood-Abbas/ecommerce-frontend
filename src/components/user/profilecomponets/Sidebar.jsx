import {
  User,
  Package,
  LogOut,
  Store,
} from "lucide-react";

export default function Sidebar({ activeTab, setActiveTab, profile }) {
  const menuItem = (id, label, Icon) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition
        ${activeTab === id ? "bg-gray-100 text-(--primary-color) font-medium" : "text-gray-700 hover:bg-gray-100"}
      `}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  return (
    <aside className="lg:sticky lg:top-24  col-span-12 md:col-span-3 bg-white shadow-md rounded-2xl p-6 h-fit space-y-6">

      {/* PROFILE SECTION */}
      <div>
        <p className="text-gray-500 text-sm">Hello,</p>
        <h2 className="text-xl font-semibold text-gray-800">{profile.name || "User"}</h2>
        <p className="text-xs text-gray-400 mt-1">Welcome to your dashboard</p>
      </div>

      {/* ACCOUNT SECTION */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">
          Manage My Account
        </h3>

        {menuItem("profile", "My Profile", User)}
      </div>

      {/* ORDERS SECTION */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">
          Orders
        </h3>

        {menuItem("orders", "My Orders", Package)}
      </div>

      {/* SELLER SECTION */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">
          Sell
        </h3>

        {menuItem("seller", "Become a Seller", Store)}
      </div>

      {/* LOGOUT */}
      <div className="border-t pt-4">
        <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition text-red-600 hover:bg-red-50">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
