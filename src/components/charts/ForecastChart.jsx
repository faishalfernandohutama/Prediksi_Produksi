// src/components/ForecastChart.jsx

import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Label, Legend // Kita tambahkan Legend (legenda)
} from 'recharts';

// Ganti path ini jika gambar latar chart Anda berbeda
import ChartBackground from '../../assets/hero.png';

// --- Custom Tooltip yang dimodifikasi untuk 3 skenario ---
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-lg p-3 border border-gray-200">
        {/* 'label' akan berisi tanggal, misal "2025-01" */}
        <p className="text-sm font-bold text-gray-800">{`Tanggal: ${label}`}</p>
        
        {/* Kita .map() semua data yang ada di payload */}
        {payload.map((item, index) => (
          <p key={index} className="text-sm font-medium" style={{ color: item.color }}>
            {`${item.name}: ${item.value} ton`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const ForecastChart = () => {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedTanaman, setSelectedTanaman] = useState('Minyak Sawit'); // Default

  // Daftar tanaman sesuai skripsi Anda
  const tanamanOptions = ['Minyak Sawit', 'Karet Kering', 'Gula Tebu', 'Kopi', 'Teh'];

  // 1. useEffect untuk MEMUAT data CSV (hanya sekali)
  useEffect(() => {
    // Pastikan path ini benar menunjuk ke file CSV di folder /public
    Papa.parse('/data/Forecasts_2025_2027_CatBoost_RollingOrigin.csv', {
      download: true,
      header: true,
      delimiter: ',',
      complete: (result) => {
        setAllData(result.data);
      },
      error: (err) => {
        console.error("Error parsing CSV:", err);
      }
    });
  }, []);

  // 2. useEffect untuk MEMFILTER data saat 'selectedTanaman' berubah
  useEffect(() => {
    const dataForChart = allData
      .filter(row => row.Tanaman === selectedTanaman)
      .map(row => ({
        // Buat format tanggal 'YYYY-MM' untuk sumbu X
        date: `${row.Tahun}-${String(row.Bulan).padStart(2, '0')}`,
        Tahun: parseInt(row.Tahun),
        Bulan: parseInt(row.Bulan),
        // Ubah data prediksi menjadi angka (Float)
        Prediksi_Normal: parseFloat(row.Prediksi_Normal),
        Prediksi_Optimistis: parseFloat(row.Prediksi_Optimistis),
        Prediksi_Pesimistis: parseFloat(row.Prediksi_Pesimistis),
      }))
      // Urutkan berdasarkan Tahun lalu Bulan
      .sort((a, b) => a.Tahun - b.Tahun || a.Bulan - b.Bulan);
      
    setFilteredData(dataForChart);
  }, [allData, selectedTanaman]); // Dijalankan ulang jika data atau filter berubah

  return (
    // Kita gunakan motion.div yang sama persis seperti chart sebelumnya
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: true }}
      className="relative w-full shadow-2xl rounded-2xl overflow-hidden"
    >
      {/* Latar belakang gambar dan overlay (sama persis) */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${ChartBackground})` }}
      />
      <div
        className="absolute inset-0 z-10 bg-white/80 backdrop-blur-md border border-white/40"
      />
      
      {/* Konten Chart (Z-index 20) */}
      <div className="relative z-20 p-6">
        
        {/* --- Judul dan Filter Dropdown --- */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <h1 className="text-2xl font-archivo-black text-gray-700 text-center md:text-left">
            Prediksi Skenario 3 (2025–2027)
          </h1>
          <div className="flex items-center mt-2 md:mt-0">
            <label htmlFor="tanaman-select" className="mr-2 text-sm font-medium text-gray-600">
              Pilih Tanaman:
            </label>
            <select 
              id="tanaman-select"
              value={selectedTanaman}
              onChange={(e) => setSelectedTanaman(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              {tanamanOptions.map(tanaman => (
                <option key={tanaman} value={tanaman}>{tanaman}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredData.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={filteredData}>
              {/* Kita tidak pakai <Area> di sini agar 3 garis tidak menumpuk 
                dan jadi berantakan. Kita hanya pakai <Line>.
              */}
              <CartesianGrid
                vertical={false} 
                stroke="#e5e7eb" 
                strokeOpacity={0.7} 
              />
              <XAxis dataKey="date" tick={{ fill: '#374151' }}>
                <Label value="Tahun-Bulan" position="insideBottom" offset={-5} style={{ textAnchor: 'middle', fill: '#6b7280' }} />
              </XAxis>
              <YAxis 
                tick={{ fill: '#374151' }} 
                tickFormatter={(value) => `${value} ton`}
              >
                <Label value="Prediksi Produksi (ton)" angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fill: '#6b7280' }} />
              </YAxis>
              
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ stroke: '#4338ca', strokeWidth: 1, strokeDasharray: '3 3' }}
              />
              
              {/* Legenda untuk membedakan 3 garis */}
              <Legend verticalAlign="top" height={36} />

              {/* --- 3 Garis Prediksi --- */}
              <Line
                type="monotone"
                dataKey="Prediksi_Normal"
                name="Skenario Normal"
                stroke="#4338ca" // Biru/Indigo (Warna utama)
                strokeWidth={3} 
                dot={false} 
                activeDot={{ r: 8 }}
                animationDuration={1600}
              />
              <Line
                type="monotone"
                dataKey="Prediksi_Optimistis"
                name="Skenario Optimistis"
                stroke="#16a34a" // Hijau
                strokeWidth={2} 
                dot={false} 
                activeDot={{ r: 8 }}
                animationDuration={1600}
              />
              <Line
                type="monotone"
                dataKey="Prediksi_Pesimistis"
                name="Skenario Pesimis"
                stroke="#d97706" // Oranye/Amber
                strokeWidth={2} 
                strokeDasharray="5 5" // Garis putus-putus
                dot={false} 
                activeDot={{ r: 8 }}
                animationDuration={1600}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center mt-10">Memuat data atau data tidak tersedia...</p>
        )}
      </div>
    </motion.div>
  );
};

export default ForecastChart;