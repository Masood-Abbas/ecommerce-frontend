// import { Search, ShoppingCart, X } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import AvatarMenu from "./Avature";
// import MobileNav from "./MobileNav";
// import NavLinks from "./NavLinks";
// import { navLinks } from "../../utils/static/Navdata";
// import { useNavigate } from "react-router-dom";
// import { useCartActions } from "../../hooks/cart/useCart";
// import logo from "../../assets/logo/logo1.png";
// import { setCategories } from "@/Redux/categoriesSlice/categoriesSlice";
// import { useApiResponse } from "@/hooks/ResponseApiHook";
// import { selectIsAuthenticated } from "@/Redux/authSlice/authSlice";
// import useDebounce from "@/hooks/useDebounce";

// const NavMenu = () => {
//   const [searchOpen, setSearchOpen] = useState(false);
//   const [isFixed, setIsFixed] = useState(false);
//   const navigate = useNavigate();
//   let cartCount = useSelector((state) => state.cart.totalQuantity);
//   const { fetchCart } = useCartActions();
//   const isAuth = useSelector(selectIsAuthenticated);

//   // search
//   const [query, setQuery] = useState("");
//   const [searchResults, setSearchResults] = useState([]);

//   //  fetch categories
//   const { fetchApi } = useApiResponse({
//     endpoint: "/category/getallcategory",
//     method: "get",
//     reduxAction: setCategories,
//   });

//   const handleScroll = () => {
//     setIsFixed(window.scrollY > 50);
//   };
//   // fetch Cart
//   useEffect(() => {
//     if (isAuth) {
//       fetchCart();
//     }
//   }, [isAuth]);
//   // fixed naavbar
//   useEffect(() => {
//     handleScroll();
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);
//   // fetch categories
//   useEffect(() => {
//     fetchApi();
//   }, []);
//   // Fetch search results
// const { fetchApi:searchfetch,data } = useApiResponse({
//     endpoint: "/product/searchproducts",
//     method: "get",
//   });
// console.log("data........",data)
//   const debouncedQuery = useDebounce(query, 500);
//   useEffect(() => {
//     if (!debouncedQuery) return setSearchResults([]);
//     searchfetch()
//   },[debouncedQuery]);

//   const handleCart = () => {
//     navigate("/cart");
//   };

//   return (
//     <div
//       className={`w-full py-3 bg-white shadow-sm z-50 
//   transition-all duration-500 
//   ${
//     isFixed
//       ? "fixed top-0 left-0 shadow-lg  bg-white/90 backdrop-blur-lg"
//       : "sticky top-0"
//   }
// `}
//     >
//       <div className="main-container flex justify-between items-center">
//         <div
//           className="flex items-center gap-2 cursor-pointer"
//           onClick={() => navigate("/")}
//         >
//           <img
//             src={logo}
//             alt="Exclusive Logo"
//             className="h-10 w-auto rounded-full"
//           />
//           {/* <h2 className="text-2xl font-bold">Shopli</h2> */}
//         </div>

//         <div className="hidden md:flex items-center gap-8 text-base  ">
//           <NavLinks links={navLinks} />
//         </div>

//         <div className="hidden md:flex items-center gap-4">
//           {!searchOpen ? (
//             <button
//               onClick={() => setSearchOpen(true)}
//               className="cursor-pointer"
//             >
//               <Search size={20} />
//             </button>
//           ) : (
//             <div className="flex items-center gap-3 bg-gray-100 px-3 py-2 rounded-md w-64">
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 className="bg-transparent outline-none w-full"
//               />
//               <Search size={20} />
//               <button onClick={() => setSearchOpen(false)}>
//                 <X size={20} />
//               </button>
//             </div>
//           )}

//           {/* Avatar Menu */}
//           <AvatarMenu />

//           {isAuth && (
//             <div className="relative cursor-pointer" onClick={handleCart}>
//               <ShoppingCart size={20} />
//               <span className="absolute -top-3 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full  ">
//                 {cartCount}
//               </span>
//             </div>
//           )}
//         </div>

//         {/* Mobile */}
//         <MobileNav
//           isAuth={isAuth}
//           navLinks={navLinks}
//           cartCount={cartCount}
//           handleCart={handleCart}
//         />
//       </div>
//     </div>
//   );
// };

// export default NavMenu;


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
import useDebounce from "@/hooks/useDebounce";

const NavMenu = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const navigate = useNavigate();
  const cartCount = useSelector((state) => state.cart.totalQuantity);
  const { fetchCart } = useCartActions();
  const isAuth = useSelector(selectIsAuthenticated);

  /* ================= Categories ================= */
  const { fetchApi: fetchCategories } = useApiResponse({
    endpoint: "/category/getallcategory",
    method: "get",
    reduxAction: setCategories,
  });

  /* ================= Search API ================= */
  const {
    fetchApi: fetchSearch,
    data: searchData,
    loading: searchLoading,
  } = useApiResponse({
    endpoint: "/product/searchproducts",
    method: "get",
  });

  const debouncedQuery = useDebounce(query, 500);

  /* ================= Fetch Search ================= */
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSearchResults([]);
      return;
    }

    fetchSearch({
      keyword: debouncedQuery,
    });
  }, [debouncedQuery]);

  /* ================= Update Results ================= */
  useEffect(() => {
    if (searchData?.products) {
      setSearchResults(searchData.products);
    }
  }, [searchData]);

  /* ================= Cart ================= */
  useEffect(() => {
    if (isAuth) fetchCart();
  }, [isAuth]);

  /* ================= Scroll ================= */
  useEffect(() => {
    const handleScroll = () => setIsFixed(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ================= Categories ================= */
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCart = () => navigate("/cart");

  return (
    <div
      className={`w-full py-3 bg-white z-50 transition-all duration-500 ${
        isFixed
          ? "fixed top-0 left-0 shadow-lg bg-white/90 backdrop-blur-lg"
          : "sticky top-0"
      }`}
    >
      <div className="main-container flex justify-between items-center">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="Logo" className="h-10 rounded-full" />
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <NavLinks links={navLinks} />
        </div>

        {/* Search + Avatar + Cart */}
        <div className="hidden md:flex items-center gap-4 relative">
          {!searchOpen ? (
            <button onClick={() => setSearchOpen(true)}>
              <Search size={20} />
            </button>
          ) : (
            <div className="relative w-64">
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="bg-transparent outline-none w-full"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <X
                  size={18}
                  className="cursor-pointer"
                  onClick={() => {
                    setSearchOpen(false);
                    setQuery("");
                    setSearchResults([]);
                  }}
                />
              </div>

              {/* Dropdown */}
              {searchOpen && (
                <div className="absolute top-12 left-0 w-full bg-white shadow-lg rounded-md z-50 max-h-64 overflow-y-auto">
                  {searchLoading && (
                    <p className="p-3 text-sm text-gray-500">Searching...</p>
                  )}

                  {!searchLoading && searchResults.length === 0 && query && (
                    <p className="p-3 text-sm text-gray-500">No results found</p>
                  )}

                  {searchResults.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => {
                        navigate(`/product/${item.id}`);
                        setSearchOpen(false);
                        setQuery("");
                        setSearchResults([]);
                      }}
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Avatar */}
          <AvatarMenu />

          {/* Cart */}
          {isAuth && (
            <div className="relative cursor-pointer" onClick={handleCart}>
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
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

