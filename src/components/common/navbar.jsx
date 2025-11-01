import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const Navbar = () => {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const toggleNav = () => setIsOpen(!isOpen)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const linkClass = (path) =>
    `px-3 py-2 rounded-md ${
      location.pathname === path
        ? 'bg-green-700 text-white'
        : 'text-gray-700 hover:bg-green-100'
    }`

  return (
    <header
      className={`fixed top-0 w-full z-20 flex items-center justify-between px-6 py-4 transition-all duration-300 ${
        isScrolled
          ? 'bg-biru-hitam shadow-md backdrop-blur-sm'
          : 'bg-transparent shadow-none'
      }`}
    >
      {/* Logo di tengah */}
      <h1 className="text-xl font-extrabold text-white md:mx-10 sm:mx-auto font-archivo-black">
        Produksi
      </h1>

      {/* Menu desktop */}
      <nav className="hidden md:flex gap-4 md:font-bold">
        <Link to="/" className={linkClass('/')}>Home</Link>
        <Link to="/algoritma" className={linkClass('/algoritma')}>Algoritma</Link>
        <Link to="/dataset" className={linkClass('/dataset')}>Dataset</Link>
        <Link to="/results" className={linkClass('/results')}>Hasil</Link>
      </nav>

      {/* Tombol hamburger di kiri */}
      <div className="absolute left-4 md:hidden">
        <button className='p-2 bg-green-600 rounded-full text-white' onClick={toggleNav}>
          {isOpen ? <X size={24}  /> : <Menu size={24}/>}
        </button>
      </div>

      {/* Menu mobile */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md md:hidden flex flex-col items-center space-y-4 py-4">
          <Link onClick={() => setIsOpen(false)} to="/" className={linkClass('/')}>Home</Link>
          <Link onClick={() => setIsOpen(false)} to="/algoritma" className={linkClass('/algoritma')}>Algoritma</Link>
          <Link onClick={() => setIsOpen(false)} to="/dataset" className={linkClass('/dataset')}>Dataset</Link>
          <Link onClick={() => setIsOpen(false)} to="/results" className={linkClass('/results')}>Hasil</Link>
        </div>
      )}
    </header>
  )
}

export default Navbar
