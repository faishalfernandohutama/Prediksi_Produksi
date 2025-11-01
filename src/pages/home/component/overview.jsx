import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Area // Pastikan 'Area' di-import
} from 'recharts';

import ChartBackground from '../../../assets/hero.png';

// --- Komponen Custom Tooltip (IDE 2) ---
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-lg p-3 border border-gray-200">
        <p className="text-sm font-bold text-gray-800">{`Tahun: ${label}`}</p>
        <p className="text-sm text-indigo-600 font-medium">
          {`Rata-rata Produksi: ${payload[0].value} ton`}
        </p>
      </div>
    );
  }
  return null;
};

const Overview = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    Papa.parse('/data/akansayapakai.csv', {
      download: true,
      header: true,
      delimiter: ',',
      complete: (result) => {
        const grouped = {};
        result.data.forEach((row) => {
          const tahun = row.tahun || row.Tahun;
          const produksi = parseFloat(row.produksi || row.Produksi);
          if (!isNaN(produksi)) {
            if (!grouped[tahun]) grouped[tahun] = [];
            grouped[tahun].push(produksi);
          }
        });

        const averaged = Object.entries(grouped).map(([tahun, values]) => ({
          year: parseInt(tahun),
          produksi: (
            values.reduce((a, b) => a + b, 0) / values.length
          ).toFixed(2),
        }));

        setData(averaged.sort((a, b) => a.year - b.year));
      },
    });
  }, []);

  return (
    <section className="bg-merah-muda py-16 px-6 flex flex-col items-center">

      {/* Bagian Hero (Tidak Berubah) */}
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-6xl font-extrabold mb-4 text-gray-900 font-archivo-black tracking-tighter leading-[1.1] lg:text-8xl">
          GOOD FOR<br />THE PLANET.<br />AND YOUR<br />BUSINESS
        </h2>
        <p className="text-gray-600 leading-relaxed mb-6">
          We are on a mission to help good businesses grow.<br />
          This is why we reward sustainable businesses with lower fees,<br />
          freeing up even more of your cash. Get started and access funding in 5 minutes.
        </p>
        <div className="bg-green-700 mx-auto inline-block px-8 py-3 rounded-lg hover:bg-green-800 transition">
          <p className="text-white font-bold">Get Funding</p>
        </div>
      </div>

       <div className='mt-10 mb-4 text-left'>
        <p className='bg-green-500 mx-auto inline-block px-2 py-1 rounded-full mb-2'>01</p>
        <h2 className='font-oswald font-extrabold text-4xl'>GROW WITH THE FLOW</h2>
        <p className='text-md my-4'>We help you preserve your cash, so that you can focus on growing your business and imporve cash flow</p>
      </div>
      {/* Chart Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        viewport={{ once: true }}
        className="relative w-full max-w-4xl shadow-2xl rounded-2xl overflow-hidden"
      >
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${ChartBackground})` }}
        />
        <div
          className="absolute inset-0 z-10 bg-white/80 backdrop-blur-md border border-white/40"
        />

        {/* Lapisan Konten (Chart) */}
        <div className="relative z-20 p-6">

          <h1 className="text-2xl font-archivo-black text-gray-700 mb-4 text-center">
            Tren Rata-rata Produksi Perkebunan (2009–2024)
          </h1>

          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={data}>

                {/* IDE 1: Defs untuk gradient Area Fill */}
                <defs>
                  <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8} /> {/* Indigo-500, opacity 80% */}
                    <stop offset="100%" stopColor="#c7d2fe" stopOpacity={0.0} /> {/* Indigo-200, full transparent */}
                  </linearGradient>
                </defs>

                {/* IDE 3: Grid dibuat lebih samar & hanya horizontal */}
                <CartesianGrid
                  vertical={false} 
                  stroke="#e5e7eb" 
                  strokeOpacity={0.7} 
                />

                <XAxis dataKey="year" tick={{ fill: '#374151' }} />
                <YAxis tick={{ fill: '#374151' }} />

                {/* IDE 2: Tooltip menggunakan komponen kustom */}
                <Tooltip content={<CustomTooltip />} />

                {/* IDE 1: KOMPONEN <Area> untuk mengisi area di bawah garis */}
                {/* Ini harus diletakkan SEBELUM <Line> agar tidak menutupi garisnya */}
                <Area
                  type="monotone"
                  dataKey="produksi"
                  strokeWidth={0} 
                  fill="url(#chartFill)" 
                  animationDuration={1600}
                />

                {/* IDE 1 & 3: KOMPONEN <Line> untuk garis utama */}
                <Line
                  type="monotone"
                  dataKey="produksi"
                  stroke="#4338ca" 
                  strokeWidth={3} 
                  dot={false} 
                  activeDot={{ 
                    r: 8,
                    fill: '#6366f1', 
                    stroke: '#4338ca', 
                    strokeWidth: 2
                  }}
                  animationDuration={1600}
                />

              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center mt-10">Memuat data...</p>
          )}
        </div>
      </motion.div>
    </section>
  );
};

export default Overview;