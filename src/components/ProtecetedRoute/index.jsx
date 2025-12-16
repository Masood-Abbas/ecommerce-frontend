import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/Redux/authSlice/authSlice";

const ProtectedRoute = () => {
   const isAuth = useSelector(selectIsAuthenticated);

  if (!isAuth) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default ProtectedRoute;