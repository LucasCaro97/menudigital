import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import MenuRestaurante from './components/MenuRestaurante'
import { TopBanner } from './components/TopBanner'
import Navbar from './components/Navbar'
import AltaCategorias from './components/AltaCategorias'
import AltaProductos from './components/AltaProductos'

function App() {
  return (
    <>
    <Router>
      <Navbar />
      <TopBanner />      
      <Routes>
        <Route path="/" element={<MenuRestaurante />} />
        <Route path="/alta-categorias" element={<AltaCategorias/>} />
        <Route path="/alta-platos"  element={<AltaProductos/>} />
      </Routes>
    </Router>
    
    </>
  )
}

export default App
