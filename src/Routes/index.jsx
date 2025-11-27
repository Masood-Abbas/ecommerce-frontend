import { Route, Routes } from "react-router-dom";
import { Login, PasswordReset, Signup } from "../Pages/Auth";
import Home from "../Pages/Home";


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password/*" element={<PasswordReset />} />
    </Routes>
  );
};

export default AppRoutes;
