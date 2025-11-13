import React from 'react'
import heroimg from '../../../assets/hero.png'

const Hero = () => {
  return (
    <section
  className="w-full min-h-[90vh] bg-center bg-cover bg-no-repeat flex items-center"
  style={{ backgroundImage: `url(${heroimg})` }}
>

      <div className="container mx-auto px-6 py-20 text-white">
        <h2 className="text-6xl md:text-8xl font-extrabold font-archivo-black">PRODUKSI</h2>
        <h2 className="text-6xl md:text-8xl font-extrabold text-orange-300 font-archivo-black">PERKEBUNAN <span className="text-white">INDONESIA</span></h2>
            <p>Prediksi Produksi Perkebunan Besar 2025 - 2027 <br /> menggunakan Metode Category Boosting.</p>
      </div>
    </section>
  )
}

export default Hero