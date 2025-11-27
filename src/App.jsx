import "./App.css";
import Footer from "./components/footer/Footer";
import NavBar from "./components/navbar";
import AppRoutes from "./Routes";

const App = () => {
  return (
    <>
      <NavBar />
      <AppRoutes />
      <Footer />
    </>
  );
};

export default App;
