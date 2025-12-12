import { useState } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import AvatarMenu from "./Avature";
import NavLinks from "./NavLinks";


const MobileNav = ({ isAuthenticated, navLinks, cartCount = 0,handleCart }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center gap-4 cursor-pointer">
        <button onClick={() => setMobileOpen(true)}>
          <Menu size={28} />
        </button>

        {isAuthenticated && (
          <div className="relative cursor-pointer" onClick={handleCart} >
            <ShoppingCart size={22} />
            <span className="absolute -top-3 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          </div>
        )}

        {isAuthenticated && <AvatarMenu />}
      </div>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-gray-400 bg-opacity-40 backdrop-blur-sm z-50 transition-opacity 
        ${mobileOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setMobileOpen(false)}
      ></div>

      {/* Mobile Sliding Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl p-6 z-50 transition-transform duration-300 
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-medium">Menu</h3>
          <button onClick={() => setMobileOpen(false)} className="cursor-pointer">
            <X size={26} />
          </button>
        </div>

        {/* Mobile Links */}
        <nav className="flex flex-col gap-4 text-lg">
          <NavLinks links={navLinks} onClick={() => setMobileOpen(false)} />
        </nav>
      </div>
    </>
  );
};

export default MobileNav;
