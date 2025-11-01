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
        <h2 className="text-6xl md:text-8xl font-extrabold text-green-500 font-archivo-black">PERKEBUNAN INDONESIA</h2>
            <div className="bg-green-700 mx-auto inline-block px-8 py-3 rounded-lg my-4">
                <p className="text-white  font-bold">Get Funding</p>
            </div>
            <p>Pay suppliers faster and extend your runway — with AI that <br/> analyses your financials in real time to unlock smarter funding.</p>
      </div>
    </section>
  )
}

export default Hero