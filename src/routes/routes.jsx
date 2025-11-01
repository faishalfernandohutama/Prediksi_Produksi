import React from "react";
import { Route, Routes } from "react-router-dom";

const Routers = () => {
    return (
         <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tentangdata" element={<TentangData />} />

         </Routes>
    )
       
}

export default Routers;