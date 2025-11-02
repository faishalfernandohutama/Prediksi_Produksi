import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Area
} from 'recharts';

import ChartBackground from '../../../assets/hero.png';

// Import 4 gambar lingkaran Anda
import Icon1 from '../../../assets/fish.png';
import Icon2 from '../../../assets/harvest.png';
import Icon3 from '../../../assets/mountain.png';
import Icon4 from '../../../assets/energy.png';
import PerkebunanImage from '../../../assets/farmer.png';


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

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <section className="bg-merah-muda py-16 px-6 flex flex-col items-center">

      {/* Bagian Hero (Tidak Berubah) */}
      <div className="relative w-full max-w-5xl mx-auto mb-10 md:max-w-none"> 
        {/* ... (kode hero section Anda tetap sama) ... */}
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-6xl font-extrabold mb-4 text-gray-900 font-archivo-black tracking-tighter leading-[1.1] lg:text-8xl md:py-6">
            GOOD FOR<br className='md:hidden'/> THE PLANET.<br className='md:hidden' /> AND <span className='text-orange-300'>YOUR</span><br className='md:hidden' />BUSINESS
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
        <motion.div
          variants={iconVariants}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="absolute top-4 left-4 w-16 h-16 md:top-8 md:left-8 md:w-24 md:h-24 lg:top-10 lg:left-10 lg:w-60 lg:h-32 rotate-45 z-50"
        >
          <img src={Icon1} alt="Sustainability Icon 1" className="rounded-full object-cover" />
        </motion.div>
        <motion.div
          variants={iconVariants}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="absolute top-8 right-4 w-16 h-16 md:top-16 md:right-8 md:w-28 md:h-28 lg:top-20 lg:right-10 lg:w-60 rotate-[-20deg] lg:h-32"
        >
          <img src={Icon2} alt="Sustainability Icon 2" className="rounded-full object-cover" />
        </motion.div>
        <motion.div
          variants={iconVariants}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
          className="absolute bottom-20 left-2 w-14 h-14 md:bottom-16 md:left-0 md:w-20 md:h-20 lg:bottom-20 lg:left-30 lg:w-42 rotate-[-20deg] lg:h-24"
        >
          <img src={Icon3} alt="Sustainability Icon 3" className="rounded-full object-cover" />
        </motion.div>
        <motion.div
          variants={iconVariants}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.5, delay: 0.8 }}
          viewport={{ once: true }}
          className="absolute bottom-24 right-8 w-16 h-16 md:bottom-20 md:right-16 md:w-24 md:h-24 lg:bottom-10 lg:right-20 rotate-45 lg:w-42 lg:h-28"
        >
          <img src={Icon4} alt="Sustainability Icon 4" className="rounded-full object-cover" />
        </motion.div>
      </div>

      <div className='mt-10 w-full max-w-6xl lg:max-w-none md:flex md:gap-16 md:items-stretch lg:px-10'>
        <div className='mb-4 md:mb-0 md:w-1/2 text-left md:flex md:flex-col md:items-start'>
          <p className='bg-green-500 inline-block px-2 py-1 rounded-full mb-2 font-bold'>01</p>
          <h2 className='font-oswald font-extrabold text-4xl lg:text-8xl'>GROW WITH <span className='text-orange-300'><br className='hidden lg:block' />THE</span> FLOW</h2>
          <p className='text-md my-4 lg:text-2xl lg:mt-auto'>We help you preserve your cash, so that you can focus on growing your business and imporve cash flow</p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="relative w-full md:w-1/2 shadow-2xl rounded-2xl overflow-hidden"
        >
          {/* ... (kode chart Anda ada di dalam sini) ... */}
          <div
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${ChartBackground})` }}
          />
          <div
            className="absolute inset-0 z-10 bg-white/80 backdrop-blur-md border border-white/40"
          />
          <div className="relative z-20 p-6">
            <h1 className="text-2xl font-archivo-black text-gray-700 mb-4 text-center">
              Tren Rata-rata Produksi Perkebunan (2009–2024)
            </h1>
            {data.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={data}>
                  <defs>
                    <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#c7d2fe" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    vertical={false} 
                    stroke="#e5e7eb" 
                    strokeOpacity={0.7} 
                  />
                  <XAxis dataKey="year" tick={{ fill: '#374151' }} />
                  <YAxis tick={{ fill: '#374151' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="produksi"
                    strokeWidth={0} 
                    fill="url(#chartFill)" 
                    animationDuration={1600}
                  />
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
      </div>
      {/* --- AKHIR DARI BAGIAN CHART --- */}

      <div className='mt-10 w-full max-w-6xl lg:max-w-none md:flex md:gap-16 md:items-stretch lg:px-10'>
        <div className='mb-4 md:mb-0 md:w-1/2 text-left md:flex md:flex-col md:items-start'>
          <p className='bg-green-500 inline-block px-2 py-1 rounded-full mb-2 font-bold'>02</p>
          <h2 className='font-oswald font-extrabold text-4xl lg:text-8xl'>PICTURE <span className='text-orange-300'><br className='hidden lg:block' />OF</span> FARMER</h2>
          <p className='text-md my-4 lg:text-2xl lg:mt-auto'>We help you preserve your cash, so that you can focus on growing your business and imporve cash flow</p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="relative w-full md:w-1/2 shadow-2xl rounded-2xl overflow-hidden"
        >
          <img 
            src={PerkebunanImage} 
            alt="Gambar Perkebunan" 
            className="w-full h-auto object-cover"
          />
        </motion.div>
      </div>
      {/* --- AKHIR DARI BAGIAN GAMBAR --- */}

    </section>
  );
};

export default Overview;