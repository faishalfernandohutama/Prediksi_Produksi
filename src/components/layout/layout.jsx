import React from 'react'
import Navbar from '../common/navbar'
import Footer from '../common/footer'
import Home from '../../pages/home'
import Results from '../../pages/results'
import { Outlet } from 'react-router-dom'


const Layout = () => {
  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
export default Layout
