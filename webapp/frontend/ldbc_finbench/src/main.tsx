// Pagina principale dell'applicazione
// deve soltanto occuparsi di includere tutte le librerie necessarie
// e di includere il componente App
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)


