// import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Portfolio from "./components/Portfolio";
import Sluzby from "./pages/Sluzby";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />}></Route>
          <Route path="#sluzby" element={<Sluzby />}></Route>
          <Route path="#portfolio" element={<Portfolio />}></Route>
          {/* <Route path="/NasePrace" element={<NasePrace />}></Route>
          <Route path="/Reference" element={<Reference />}></Route>
          <Route path="*" element={<Error />}></Route> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
