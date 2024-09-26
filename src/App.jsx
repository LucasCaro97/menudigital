import './App.css'
import MenuRestaurante from './components/MenuRestaurante'
import { TopBanner } from './components/TopBanner'

function App() {
  const platos = [
    { nombre: "Ensalada César", categoria: "Entradas", precio: 8.99, rutaImagen: "/placeholder.svg" },
    { nombre: "Sopa de Tomate", categoria: "Entradas", precio: 6.99, rutaImagen: "/placeholder.svg" },
    { nombre: "Bruschetta", categoria: "Entradas", precio: 7.50, rutaImagen: "/placeholder.svg" },
    { nombre: "Calamares Fritos", categoria: "Entradas", precio: 9.99, rutaImagen: "/placeholder.svg" },
    { nombre: "Pasta Carbonara", categoria: "Platos Principales", precio: 12.99, rutaImagen: "/placeholder.svg" },
    { nombre: "Filete de Salmón", categoria: "Platos Principales", precio: 15.99, rutaImagen: "/placeholder.svg" },
    { nombre: "Pollo al Curry", categoria: "Platos Principales", precio: 13.50, rutaImagen: "/placeholder.svg" },
    { nombre: "Risotto de Champiñones", categoria: "Platos Principales", precio: 14.99, rutaImagen: "/placeholder.svg" },
    { nombre: "Hamburguesa Gourmet", categoria: "Platos Principales", precio: 11.99, rutaImagen: "/placeholder.svg" },
    { nombre: "Paella de Mariscos", categoria: "Platos Principales", precio: 18.99, rutaImagen: "/placeholder.svg" },
    { nombre: "Tiramisú", categoria: "Postres", precio: 6.99, rutaImagen: "/placeholder.svg" },
    { nombre: "Crème Brûlée", categoria: "Postres", precio: 7.50, rutaImagen: "/placeholder.svg" },
    { nombre: "Tarta de Manzana", categoria: "Postres", precio: 5.99, rutaImagen: "/placeholder.svg" },
    { nombre: "Helado de Vainilla", categoria: "Postres", precio: 4.99, rutaImagen: "/placeholder.svg" },
    { nombre: "Vino Tinto", categoria: "Bebidas", precio: 19.99, rutaImagen: "/placeholder.svg" },
    { nombre: "Cerveza Artesanal", categoria: "Bebidas", precio: 5.99, rutaImagen: "/placeholder.svg" },
    { nombre: "Agua Mineral", categoria: "Bebidas", precio: 2.50, rutaImagen: "/placeholder.svg" },
    { nombre: "Café Espresso", categoria: "Bebidas", precio: 2.99, rutaImagen: "/placeholder.svg" },
    { nombre: "Limonada Casera", categoria: "Bebidas", precio: 3.99, rutaImagen: "/placeholder.svg" },
    { nombre: "Smoothie de Frutas", categoria: "Bebidas", precio: 4.99, rutaImagen: "/placeholder.svg" }
  ]


  return (
    <>
    
    <TopBanner />    
    <MenuRestaurante platos={platos} />
    
    </>
  )
}

export default App
