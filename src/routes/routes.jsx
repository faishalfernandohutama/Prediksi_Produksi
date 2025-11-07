import React from "react";
import { Route, Routes } from "react-router-dom";

// Pastikan path ini sesuai dengan lokasi file halaman Anda
import Home from "../pages/home";
import TentangData from "../pages/tentangdata";
import Hasil from "../pages/results/components/Hasil";

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/hasil" element={<Hasil />} />
    </Routes>
  );
};

export default Routers;