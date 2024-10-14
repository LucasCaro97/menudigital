import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import MenuRestaurante from './components/MenuRestaurante'
import { TopBanner } from './components/TopBanner'
import Navbar from './components/Navbar'
import AltaCategorias from './components/AltaCategorias'
import AltaProductos from './components/AltaProductos'
import LoginForm from './components/LoginForm'
import { AuthProvider } from './components/AuthContext'

function App() {
  return (
    <>
    <AuthProvider>
    <Router>
      <Navbar />
      <TopBanner />      
      <Routes>
        <Route path="/" element={<MenuRestaurante />} />
        <Route path="/alta-categorias" element={<AltaCategorias/>} />
        <Route path="/alta-platos"  element={<AltaProductos/>} />
        <Route path="/login"  element={<LoginForm/>} />
      </Routes>
    </Router>
    </AuthProvider>
    </>
  )
}

export default App
