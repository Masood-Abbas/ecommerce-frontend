import { Route, Routes } from "react-router-dom";
import { Login, PasswordReset, Signup } from "../Pages/Auth";
import Home from "../Pages/Home";
import CartPage from "@/Pages/cart/cart";
import ProductDetail from "@/Pages/productDetail";
import CategoryPage from "@/Pages/Category/categoryPage";
import ProductPage from "@/Pages/Category/productPage";
import ProfilePage from "@/Pages/ProfilePage";


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password/*" element={<PasswordReset />} />
      <Route path="/cart" element={<CartPage/>} />
      <Route path="/product/:id" element={<ProductDetail/>} />
      <Route path="/category/:id" element={<CategoryPage />} />
      <Route path="/products" element={<ProductPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
};

export default AppRoutes;
