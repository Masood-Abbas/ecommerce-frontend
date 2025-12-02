import { Route, Routes } from "react-router-dom";
import { Login, PasswordReset, Signup } from "../Pages/Auth";
import Home from "../Pages/Home";
import CartPage from "@/Pages/cart/cart";


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password/*" element={<PasswordReset />} />
      <Route path="/cart" element={<CartPage/>} />
    </Routes>
  );
};

export default AppRoutes;
