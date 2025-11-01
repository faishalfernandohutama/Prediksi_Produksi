import React from 'react'
import Navbar from '../common/navbar'
import Footer from '../common/footer'
import Home from '../../pages/home'

const layout = () => {
  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <main>
        <Home />
      </main>
      <Footer />
      
    </div>
  )
}
export default layout
