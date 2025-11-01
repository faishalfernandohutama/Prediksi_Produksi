import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/layout/layout.jsx'
import Home from './pages/home/index.jsx'
import Algoritma from "./pages/algoritma/index.jsx";
import Dataset from './pages/dataset/index.jsx'
import Results from './pages/results/index.jsx'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="algoritma" element={<Algoritma />} />
        <Route path="dataset" element={<Dataset />} />
        <Route path="results" element={<Results />} />
      </Route>
    </Routes>
  )
}

export default App
