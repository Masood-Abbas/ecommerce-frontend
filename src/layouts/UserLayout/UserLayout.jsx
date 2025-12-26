import Footer from "@/layouts/UserLayout/footer/Footer";
import NavBar from "@/layouts/UserLayout/navbar";
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
