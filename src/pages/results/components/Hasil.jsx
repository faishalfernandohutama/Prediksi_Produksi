// src/pages/Hasil.jsx (atau apapun nama file Anda)

import React from 'react';
import { motion } from 'framer-motion';

// 1. Import komponen chart yang sudah kita buat
import ForecastChart from '../../../components/charts/ForecastChart';
// import BacktestChart from '../components/BacktestChart'; // (Jika Anda sudah buat)
// import WalkForwardChart from '../components/WalkForwardChart'; // (Jika Anda sudah buat)

const Hasil = () => {
  return (
    <section className="bg-merah-muda py-16 px-6 flex flex-col items-center overflow-x-hidden">
      
      {/* Judul Halaman Hasil */}
      <h1 className="text-5xl lg:text-7xl font-archivo-black text-gray-900 mb-12 text-center">
        Hasil Eksperimen & Prediksi
      </h1>

      {/* --- Tampilkan Chart Skenario 3 --- */}
      {/* Kita bungkus dalam div agar lebarnya konsisten */}
      <div className='w-full max-w-6xl lg:max-w-none lg:px-10'>
        <ForecastChart />
      </div>

      {/* --- Nanti Anda bisa tambahkan chart S1 dan S2 di sini --- */}
      
      {/* <h2 className="text-4xl lg:text-5xl font-oswald text-gray-800 mt-16 mb-8 text-center">
        Hasil Skenario 2 (Walk-Forward)
      </h2>
      <div className='w-full max-w-6xl lg:max-w-none lg:px-10'>
        {/* <WalkForwardChart /> */}
      {/* </div> */}

      {/* <h2 className="text-4xl lg:text-5xl font-oswald text-gray-800 mt-16 mb-8 text-center">
        Hasil Skenario 1 (Baseline)
      </h2>
      <div className='w-full max-w-6xl lg:max-w-none lg:px-10'>
        {/* <BacktestChart /> */}
      {/* </div> */}

    </section>
  );
};

export default Hasil;