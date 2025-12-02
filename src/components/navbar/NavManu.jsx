import { Search, ShoppingCart, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AvatarMenu from "./Avature";
import MobileNav from "./MobileNav";
import NavLinks from "./NavLinks";
import { navLinks } from "@/utils/static/Navdata";
import { useNavigate } from "react-router-dom";

const NavMenu = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const navigate=useNavigate()
  const { isAuthenticated } = useSelector((state) => state.auth);
   const cartCount = useSelector((state) => state.cart.totalQuantity);

  useEffect(() => {
    const handleScroll = () => {
      setIsFixed(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handCart=()=>{
    navigate("/cart")
  }

  return (
    <div
      className={`w-full py-3 bg-white shadow-sm z-50 
  transition-all duration-500 
  ${
    isFixed
      ? "fixed top-0 left-0 shadow-lg bg-opacity-95 backdrop-blur-md"
      : "sticky top-0"
  }
`}
    >
      <div className="main-container flex justify-between items-center">
        <h2 className="text-2xl font-bold cursor-pointer">Exclusive</h2>

        <div className="hidden md:flex items-center gap-8">
          <NavLinks links={navLinks} />
        </div>

        <div className="hidden md:flex items-center gap-4">
          {!searchOpen ? (
            <button
              onClick={() => setSearchOpen(true)}
              className="cursor-pointer"
            >
              <Search size={22} />
            </button>
          ) : (
            <div className="flex items-center gap-3 bg-gray-100 px-3 py-2 rounded-md w-64">
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent outline-none w-full"
              />
              <Search size={20} />
              <button onClick={() => setSearchOpen(false)}>
                <X size={20} />
              </button>
            </div>
          )}

          {/* Avatar Menu */}
          <AvatarMenu />

          {isAuthenticated && (
            <div className="relative" onClick={handCart}>
              <ShoppingCart size={22} />
              <span className="absolute -top-3 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            </div>
          )}
        </div>

        {/* Mobile */}
        <MobileNav
          isAuthenticated={isAuthenticated}
          navLinks={navLinks}
          cartCount={cartCount}
        />
      </div>
    </div>
  );
};

export default NavMenu;
