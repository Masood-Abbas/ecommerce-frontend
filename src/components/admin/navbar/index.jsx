import { Menu } from "lucide-react";
import UserDashboard from "@/components/vendor/userDashboard";
import { useSelector } from "react-redux";

export function Topbar({ onMenuClick }) {
  const user = useSelector((state) => state.auth.user);
  return (
    <header
      className="flex items-center justify-between px-6 py-4  border-b sticky top-0 z-50
  bg-white/70 backdrop-blur-md">
      {/* LEFT SECTION */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-md hover:bg-slate-100"
        >
          <Menu size={22} />
        </button>

        {/* Title */}
        <div>
          <h1 className="hidden md:block text-xl font-semibold">
            Welcome back, {user?.name || "N/A"}!
          </h1>

          <h1 className="md:hidden text-xl font-semibold">
            {user?.name || "N/A"}
          </h1>

          <p className="hidden md:block text-sm text-slate-500">
            Platform overview
          </p>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-4">
        {/* Search */}
        {/* <div className="relative hidden sm:block">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search products, orders..."
            className="pl-9 pr-4 py-2 border rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div> */}

        {/* dashboard */}
        <UserDashboard />
        {/* Profile Avatar */}
        <div className="w-9 h-9 rounded-full overflow-hidden bg-(--primary-color) flex items-center justify-center">
          {user?.images?.[0]?.url ? (
            <img
              src={user.images[0].url}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white font-medium ">
              {user?.name?.charAt(0) || "S"}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
