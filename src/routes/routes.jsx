import React from "react";
import { Route, Routes } from "react-router-dom";

// Pastikan path ini sesuai dengan lokasi file halaman Anda
import Home from "../pages/home";
import TentangData from "../pages/tentangdata";

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tentangdata" element={<TentangData />} />
    </Routes>
  );
};

export default Routers;