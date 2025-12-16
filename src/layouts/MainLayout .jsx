import Footer from "@/components/footer/Footer";
import NavBar from "@/components/navbar";
import { Outlet } from "react-router-dom";


const MainLayout = () => {
  return (
    <>
      <NavBar />
      <Outlet />
      <Footer />
    </>
  );
};

export default MainLayout;
