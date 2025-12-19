import Footer from "@/components/footer/Footer";
import NavBar from "@/components/navbar";


import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/Redux/authSlice/authSlice";

const VendorLayout = () => {
  const {user} = useSelector((state) => state.auth);
  console.log("user",user)
  const isAuth = useSelector(selectIsAuthenticated);

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "vendor") {
    return <Navigate to="/" replace />;
  }

  return (
    <div >
      <NavBar />
       <Outlet />
       <Footer />
    </div>
  );
};

export default VendorLayout;
