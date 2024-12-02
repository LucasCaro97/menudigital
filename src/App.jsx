import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import MenuRestaurante from './components/MenuRestaurante'
import { TopBanner } from './components/TopBanner'
import Navbar from './components/Navbar'
import AltaCategorias from './components/AltaCategorias'
import AltaProductos from './components/AltaProductos'
import LoginForm from './components/LoginForm'
import { AuthProvider } from './components/AuthContext'
import LandingPage from './pages/LandingPage'
import RegistroForm from './components/RegisterForm'

function App() {
  return (
    <>
    <AuthProvider>
    <Router>      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/alta-categorias" element={<AltaCategorias/>} />
        <Route path="/alta-platos"  element={<AltaProductos/>} />
        <Route path="/login"  element={<LoginForm/>} />
        <Route path="/registro"  element={<RegistroForm/>} />
        <Route path="/menu"  element={<MenuRestaurante/>} />
        
      </Routes>
    </Router>
    </AuthProvider>
    </>
  )
}

export default App
