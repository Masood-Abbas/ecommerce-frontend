import { selectIsAuthenticated } from "@/Redux/authSlice/authSlice";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";


const ProtectedRoute = ({ children }) => {
  const isAuth = useSelector(selectIsAuthenticated);

  if (!isAuth) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
