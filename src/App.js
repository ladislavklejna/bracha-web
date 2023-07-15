// import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home";
import Layout from "./pages/Layout";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />}></Route>
          {/* <Route path="/Kontakt" element={<Kontakt />}></Route>
          <Route path="/Nabizime" element={<Nabizime />}></Route>
          <Route path="/NasePrace" element={<NasePrace />}></Route>
          <Route path="/Reference" element={<Reference />}></Route>
          <Route path="*" element={<Error />}></Route> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
