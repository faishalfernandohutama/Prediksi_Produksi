// src/components/ForecastChart.jsx

import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Label, Legend 
} from 'recharts';

// --- PERBAIKAN 1: Path disamakan dengan Overview.jsx ---
import ChartBackground from '../../assets/hero.png'; 
// (Asumsi path ini yang benar, sesuaikan jika perlu)

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

const ForecastChart = () => {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedTanaman, setSelectedTanaman] = useState('Minyak Sawit'); 

  const tanamanOptions = ['Minyak Sawit', 'Karet Kering', 'Gula Tebu', 'Kopi', 'Teh'];

  // 1. useEffect untuk MEMUAT data CSV (hanya sekali)
  useEffect(() => {
    // Pastikan path ini benar: [PROYEK]/public/data/namafile.csv
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

  // --- PERBAIKAN 2: Logika filter diubah total untuk 'memutar' (pivot) data ---
  useEffect(() => {
    // 1. Filter data berdasarkan tanaman yang dipilih
    const dataTanaman = allData.filter(row => row.Tanaman === selectedTanaman);

    // 2. Kelompokkan data (dari long ke wide)
    const groupedByDate = dataTanaman.reduce((acc, row) => {
      const date = `${row.Tahun}-${String(row.Bulan).padStart(2, '0')}`;
      
      // Jika 'date' belum ada di 'acc', buat entri baru
      if (!acc[date]) {
        acc[date] = {
          date: date,
          Tahun: parseInt(row.Tahun),
          Bulan: parseInt(row.Bulan),
        };
      }
      
      // 3. Isi data prediksi berdasarkan kolom 'Skenario' dari CSV
      const prediksiValue = parseFloat(row.Prediksi);
      if (row.Skenario === 'Normal') {
        acc[date].Prediksi_Normal = prediksiValue;
      } else if (row.Skenario === 'Optimistis') {
        acc[date].Prediksi_Optimistis = prediksiValue;
      } else if (row.Skenario === 'Pesimistis') {
        acc[date].Prediksi_Pesimistis = prediksiValue;
      }
      
      return acc;
    }, {}); // 'acc' adalah objek kosong di awal

    // 4. Ubah objek hasil 'reduce' kembali menjadi array
    const finalData = Object.values(groupedByDate)
      .sort((a, b) => a.Tahun - b.Tahun || a.Bulan - b.Bulan);
      
    setFilteredData(finalData);
  }, [allData, selectedTanaman]); // Dijalankan ulang jika data atau filter berubah
  // --- AKHIR PERBAIKAN 2 ---

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
                tickFormatter={(value) => `${value.toFixed(0)} ton`} // Format angka
              >
                <Label value="Prediksi Produksi (ton)" angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fill: '#6b7280' }} />
              </YAxis>
              
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ stroke: '#4338ca', strokeWidth: 1, strokeDasharray: '3 3' }}
              />
              
              <Legend verticalAlign="top" height={36} />

              <Line
                type="monotone"
                dataKey="Prediksi_Normal"
                name="Skenario Normal"
                stroke="#4338ca" 
                strokeWidth={3} 
                dot={false} 
                activeDot={{ r: 8 }}
                animationDuration={1600}
              />
              <Line
                type="monotone"
                dataKey="Prediksi_Optimistis"
                name="Skenario Optimistis"
                stroke="#16a34a" 
                strokeWidth={2} 
                dot={false} 
                activeDot={{ r: 8 }}
                animationDuration={1600}
              />
              
              {/* --- PERBAIKAN 3: Typo 'Pesimisitis' diperbaiki --- */}
              <Line
                type="monotone"
                dataKey="Prediksi_Pesimistis" // <-- Typo 'itis' dihapus
                name="Skenario Pesimis"
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
          <p className="text-gray-500 text-center mt-10">Memuat data atau data tidak tersedia...</p>
        )}
      </div>
    </motion.div>
  );
};

export default ForecastChart;