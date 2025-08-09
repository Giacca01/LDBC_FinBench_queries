// componente principale che rappresenta tutta l'applicazione
// viene composto assemblando i compoenti secondari
import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
//import './App.css'
import Navbar from "./Navbar"
import Home from "./Home"
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function Analytic() {
  return <h1 className="text-white p-4">Analytic Queries Page</h1>;
}
function Lookup() {
  return <h1 className="text-white p-4">Lookup Queries Page</h1>;
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analytic" element={<Analytic />} />
        <Route path="/lookup" element={<Lookup />} />
      </Routes>
      <p>
        Work in progress
      </p>
    </BrowserRouter>
  );
}


export default App;