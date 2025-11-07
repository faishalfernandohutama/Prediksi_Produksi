// src/components/BacktestChart.jsx

import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Label, Legend 
} from 'recharts';

// --- Path ke gambar latar ---
import ChartBackground from '../../assets/hero.png';
// (Sesuaikan path ini jika TIDAK berada di folder yang sama dengan Overview.jsx)

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-lg p-3 border border-gray-200">
        <p className="text-sm font-bold text-gray-800">{`Tanggal: ${label}`}</p>
        {payload.map((item, index) => (
          <p key={index} className="text-sm font-medium" style={{ color: item.color }}>
            {`${item.name}: ${item.value ? item.value.toFixed(2) : 'N/A'} ton`}
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
  const [selectedTanaman, setSelectedTanaman] = useState('Minyak Sawit'); 

  const tanamanOptions = ['Minyak Sawit', 'Karet Kering', 'Gula Tebu', 'Kopi', 'Teh'];

  // 1. useEffect untuk MEMUAT data CSV
  useEffect(() => {
    Papa.parse('/data/Backtest_All_Raw_Predictions_S1_CatBoost.csv', {
      download: true,
      header: true,
      delimiter: ',',
      complete: (result) => {
        setAllData(result.data);
      },
      error: (err) => {
        console.error("Error parsing S1 CSV:", err);
      }
    });
  }, []);

  // --- PERBAIKAN UTAMA DI SINI ---
  // 2. useEffect untuk MEMFILTER data
  useEffect(() => {
    const dataForChart = allData
      .filter(row => row.Tanaman === selectedTanaman)
      .map(row => {
        // Ambil 'YYYY-MM' dari kolom 'Tanggal', misal "2024-01-01" -> "2024-01"
        const date = row.Tanggal ? row.Tanggal.substring(0, 7) : 'N/A';
        
        return {
          date: date,
          
          // Gunakan nama kolom yang BENAR dari CSV
          Produksi_Aktual: parseFloat(row.Produksi), 
          Prediksi_S1: parseFloat(row.Prediksi),
        }
      })
      // Urutkan berdasarkan 'date'
      .sort((a, b) => a.date.localeCompare(b.date));
      
    setFilteredData(dataForChart);
  }, [allData, selectedTanaman]);
  // --- AKHIR PERBAIKAN ---

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: true }}
      className="relative w-full shadow-2xl rounded-2xl overflow-hidden"
    >
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${ChartBackground})` }}
      />
      <div
        className="absolute inset-0 z-10 bg-white/80 backdrop-blur-md border border-white/40"
      />
      
      <div className="relative z-20 p-6">
        
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
                tickFormatter={(value) => `${value.toFixed(0)} ton`}
              >
                <Label value="Produksi (ton)" angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fill: '#6b7280' }} />
              </YAxis>
              
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ stroke: '#4338ca', strokeWidth: 1, strokeDasharray: '3 3' }}
              />
              <Legend verticalAlign="top" height={36} />

              {/* DataKeys ini sekarang cocok dengan hasil .map() di atas */}
              <Line
                type="monotone"
                dataKey="Produksi_Aktual"
                name="Aktual"
                stroke="#4338ca" 
                strokeWidth={3} 
                dot={false} 
                activeDot={{ r: 8 }}
                animationDuration={1600}
              />
              <Line
                type="monotone"
                dataKey="Prediksi_S1"
                name="Prediksi S1 (Baseline)"
                stroke="#d97706" 
                strokeWidth={2} 
                strokeDasharray="5 5"
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