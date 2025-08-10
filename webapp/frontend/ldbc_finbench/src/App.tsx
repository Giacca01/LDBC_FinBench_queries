// componente principale che rappresenta tutta l'applicazione
// viene composto assemblando i compoenti secondari
import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
//import './App.css'
import Navbar from "./Navbar"
import Home from "./Home"
import Analytics from './Analytics'
import Lookup from './Lookup'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analytic" element={<Analytics />} />
        <Route path="/lookup" element={<Lookup />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;