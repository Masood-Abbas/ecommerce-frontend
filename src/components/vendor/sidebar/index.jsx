import { NavLink } from "react-router-dom";
import { X, Store } from "lucide-react";
import { bottomItems, menuItems } from "@/utils/static/vendor/sidebar";
import { useSelector } from "react-redux";

export function Sidebar({ open, onClose }) {
  const data = useSelector((state) => state.shop.shopData);
  const capitalizedName = data?.name
    ? data.name.charAt(0).toUpperCase() + data.name.slice(1)
    : "zero";

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-100 xl:z-50
          w-64 bg-white xl:bg-white/70 text-black flex flex-col
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* App Header */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-3 ">
            <div className="w-9 h-9 rounded-lg bg-(--primary-color) flex items-center justify-center">
              <Store size={18} className="text-white cursor-default" />
            </div>
            <div>
              <h2 className="text-base font-semibold cursor-default">VendorHub</h2>
              <p className="text-xs text-slate-400 cursor-default">Multi-Vendor Platform</p>
            </div>
          </div>

          <button className="lg:hidden" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Vendor Profile Section */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden bg-(--primary-color) flex items-center justify-center">
             {data?.images?.[0]?.url ? (
            <img
              src={data.images[0].url ||""}
              alt={data.name}
              className="w-full h-full object-cover cursor-default"
            />
          ) : (
            <span className="text-white font-medium cursor-default">
              {data?.name?.charAt(0) || "S"}
            </span>
          )}
            </div>
            <div className="leading-tight">
              <p className="text-sm font-medium cursor-default">
                {capitalizedName || "shopli"}
              </p>
              <p className="text-xs text-slate-400 truncate max-w-[130px] cursor-default">
                {data?.owner?.email || "a@gmail.com"}
              </p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition font-medium  ${
                  isActive ? "bg-gray-100 text-(--primary-color)" : "hover:bg-gray-100 text-gray-700"
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-4 pb-6 space-y-1 border-t border-gray-200">
          {bottomItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm hover:bg-slate-800"
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </div>
      </aside>
    </>
  );
}
