import { Outlet } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./Layout.css";

const Layout = () => {
  return (
    <>
      <Header />

      <Outlet />

      <div className="grey">
        <Footer />
      </div>
    </>
  );
};

export default Layout;
