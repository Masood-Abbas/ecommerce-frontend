import Footer from "@/components/footer/Footer";
import NavBar from "@/components/navbar";
import { Outlet } from "react-router-dom";


const UserLayout = () => {
  return (
    <>
      <NavBar />
      <Outlet />
      <Footer />
    </>
  );
};

export default UserLayout;
