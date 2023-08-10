import { Outlet } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./Layout.css";

const Layout = () => {
  return (
    <div className="all">
      <Header />

      <Outlet />

      <Footer />
    </div>
  );
};

export default Layout;
