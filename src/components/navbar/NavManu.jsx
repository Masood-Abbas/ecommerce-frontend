import { Search, ShoppingCart, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AvatarMenu from "./Avature";
import MobileNav from "./MobileNav";
import NavLinks from "./NavLinks";
import { navLinks } from "../../utils/static/Navdata";
import { useNavigate } from "react-router-dom";
import { useCartActions } from "../../hooks/cart/useCart";
import logo from "../../assets/logo/logo1.png";
import { setCategories } from "@/Redux/categoriesSlice/categoriesSlice";
import { useApiResponse } from "@/hooks/ResponseApiHook";
import { selectIsAuthenticated } from "@/Redux/authSlice/authSlice";


const NavMenu = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const navigate = useNavigate();
  let cartCount = useSelector((state) => state.cart.totalQuantity);
  const { fetchCart } = useCartActions();
  const isAuth = useSelector(selectIsAuthenticated);

  
//  fetch categories
const { fetchApi} = useApiResponse({
    endpoint: "/category/getallcategory",
    method: "get",
    reduxAction: setCategories
  });

  const handleScroll = () => {
    setIsFixed(window.scrollY > 50);
  };
  // fetch Cart 
  useEffect(() => {
    if (isAuth) {
      fetchCart();
    }
  }, [isAuth]);
  // fixed naavbar
  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  // fetch categories
   useEffect(() => {
    fetchApi()
  }, []);


  const handleCart = () => {
    navigate("/cart");
  };

  return (
    <div
      className={`w-full py-3 bg-white shadow-sm z-50 
  transition-all duration-500 
  ${
    isFixed
      ? "fixed top-0 left-0 shadow-lg  bg-white/90 backdrop-blur-lg"
      : "sticky top-0"
  }
`}
    >
      <div className="main-container flex justify-between items-center">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src={logo}
            alt="Exclusive Logo"
            className="h-10 w-auto rounded-full"
          />
          {/* <h2 className="text-2xl font-bold">Shopli</h2> */}
        </div>

        <div className="hidden md:flex items-center gap-8 text-base  ">
          <NavLinks links={navLinks} />
        </div>

        <div className="hidden md:flex items-center gap-4">
          {!searchOpen ? (
            <button
              onClick={() => setSearchOpen(true)}
              className="cursor-pointer"
            >
              <Search size={20} />
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

          {isAuth && (
            <div className="relative cursor-pointer" onClick={handleCart}>
              <ShoppingCart size={20} />
              <span className="absolute -top-3 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full  ">
                {cartCount}
              </span>
            </div>
          )}
        </div>

        {/* Mobile */}
        <MobileNav
          isAuth={isAuth}
          navLinks={navLinks}
          cartCount={cartCount}
          handleCart={handleCart}
        />
      </div>
    </div>
  );
};

export default NavMenu;
