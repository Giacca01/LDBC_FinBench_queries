import Navbar from "./Navbar"
import Home from "./Home"
import Analytics from './Analytics'
import Lookup from './Lookup'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
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