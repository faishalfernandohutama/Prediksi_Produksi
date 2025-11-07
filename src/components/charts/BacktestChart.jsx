// src/components/BacktestChart.jsx

import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Label, Legend 
} from 'recharts';

// Ganti path ini jika gambar latar chart Anda berbeda
import ChartBackground from '../../../assets/hero.png';

// --- Custom Tooltip (Sama seperti sebelumnya) ---
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-lg p-3 border border-gray-200">
        <p className="text-sm font-bold text-gray-800">{`Tanggal: ${label}`}</p>
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

const BacktestChart = () => {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedTanaman, setSelectedTanaman] = useState('Minyak Sawit'); // Default

  const tanamanOptions = ['Minyak Sawit', 'Karet Kering', 'Gula Tebu', 'Kopi', 'Teh'];

  // 1. useEffect untuk MEMUAT data CSV
  useEffect(() => {
    // --- UBAH PATH CSV ---
    Papa.parse('/data/Backtest_All_Raw_Predictions_S1_CatBoost.csv', {
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

  // 2. useEffect untuk MEMFILTER data
  useEffect(() => {
    const dataForChart = allData
      .filter(row => row.Tanaman === selectedTanaman)
      .map(row => ({
        // Buat format tanggal 'YYYY-MM' untuk sumbu X
        date: `${row.Tahun}-${String(row.Bulan).padStart(2, '0')}`,
        Tahun: parseInt(row.Tahun),
        Bulan: parseInt(row.Bulan),
        // --- UBAH KOLOM DATA ---
        Produksi_Aktual: parseFloat(row.Produksi_Aktual),
        Prediksi_S1: parseFloat(row.Prediksi_S1),
      }))
      .sort((a, b) => a.Tahun - b.Tahun || a.Bulan - b.Bulan);
      
    setFilteredData(dataForChart);
  }, [allData, selectedTanaman]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: true }}
      className="relative w-full shadow-2xl rounded-2xl overflow-hidden"
    >
      {/* Latar belakang (Sama) */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${ChartBackground})` }}
      />
      <div
        className="absolute inset-0 z-10 bg-white/80 backdrop-blur-md border border-white/40"
      />
      
      {/* Konten Chart (Z-index 20) */}
      <div className="relative z-20 p-6">
        
        {/* --- UBAH JUDUL dan Filter Dropdown --- */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <h1 className="text-2xl font-archivo-black text-gray-700 text-center md:text-left">
            Hasil Skenario 1 (Baseline)
          </h1>
          <div className="flex items-center mt-2 md:mt-0">
            <label htmlFor="tanaman-select-s1" className="mr-2 text-sm font-medium text-gray-600">
              Pilih Tanaman:
            </label>
            <select 
              id="tanaman-select-s1"
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
                <Label value="Produksi (ton)" angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fill: '#6b7280' }} />
              </YAxis>
              
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ stroke: '#4338ca', strokeWidth: 1, strokeDasharray: '3 3' }}
              />
              <Legend verticalAlign="top" height={36} />

              {/* --- UBAH GARIS (LINE) --- */}
              <Line
                type="monotone"
                dataKey="Produksi_Aktual"
                name="Aktual"
                stroke="#4338ca" // Biru/Indigo (Warna utama)
                strokeWidth={3} 
                dot={false} 
                activeDot={{ r: 8 }}
                animationDuration={1600}
              />
              <Line
                type="monotone"
                dataKey="Prediksi_S1"
                name="Prediksi S1 (Baseline)"
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
          <p className="text-gray-500 text-center mt-10">Memuat data...</p>
        )}
      </div>
    </motion.div>
  );
};

export default BacktestChart;