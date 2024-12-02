import React, { useState, useEffect } from "react"
import { ShoppingCart, X, Star, MapPin, Phone } from "lucide-react"
import { TopBanner } from "./TopBanner"
import Navbar from "./Navbar"
import { Link } from "react-router-dom"
import { useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function CarritoModal({ isOpen, onClose, items, onRemoveItem }) {
  const [nombre, setNombre] = useState("")
  const [direccion, setDireccion] = useState("")
  const [showForm, setShowForm] = useState(false)

  const total = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0)

  const handleRealizarPedido = async () => {
    if (nombre.trim() === "" || direccion.trim() === "") {
      alert("Por favor, complete todos los campos.");
      return;
    }


    const phoneNumber = "5493751364441";
    const itemsList = items.map(item => `${item.nombre} x ${item.cantidad}`).join('\n');
    const message = encodeURIComponent(
      `Hola, me gustaría realizar el siguiente pedido:\n\nNombre: ${nombre}\nDirección: ${direccion}\n\nPedido:\n${itemsList}\n\nTotal: $${total.toFixed(2)}`
    );
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
    onClose();
  };

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Carrito de Compras</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X size={24} />
          </button>
        </div>
        {items.length === 0 ? (
          <p className="text-gray-600">El carrito está vacío</p>
        ) : (
          <>
            <ul className="space-y-2">
              {items.map((item, index) => (
                <li key={index} className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-800">{item.nombre} x {item.cantidad}</span>
                  <span className="text-gray-600">${(item.precio * item.cantidad).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                  <button
                    onClick={() => onRemoveItem(item.nombre)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-xl font-semibold text-gray-800">
              Total: ${total.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </div>
            {!showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="mt-6 w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Realizar Pedido
              </button>
            ) : (
              <form onSubmit={(e) => e.preventDefault()} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">
                    Dirección
                  </label>
                  <input
                    type="text"
                    id="direccion"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <button
                  onClick={handleRealizarPedido}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Enviar Pedido
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function MenuRestaurante() {
  const urlApi = import.meta.env.VITE_API_URL;
  const [productos, setProductos] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [carrito, setCarrito] = useState([]);
  const [isCarritoOpen, setIsCarritoOpen] = useState(false);
  const location = useLocation();
  const { restaurantId } = location.state || {}; // Obtener el ID del restaurante

  const actualizarCantidad = (nombre, delta) => {
    setCantidades(prev => ({
      ...prev,
      [nombre]: Math.max(0, (prev[nombre] || 0) + delta)
    }));
  };

  const agregarAlCarrito = (plato) => {
    const cantidad = cantidades[plato.nombre];
    if (cantidad > 0) {
      setCarrito(prevCarrito => {
        const itemExistente = prevCarrito.find(item => item.nombre === plato.nombre);
        if (itemExistente) {
          return prevCarrito.map(item =>
            item.nombre === plato.nombre
              ? { ...item, cantidad: item.cantidad + cantidad }
              : item
          );
        } else {
          return [...prevCarrito, { ...plato, cantidad }];
        }
      });
      setCantidades(prev => ({ ...prev, [plato.nombre]: 0 }));
    }
  };

  const removerDelCarrito = (nombre) => {
    setCarrito(prevCarrito => prevCarrito.filter(item => item.nombre !== nombre));
  };

  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);

  useEffect(() => {
    const fetchProductos = async () => {
      
      if(!restaurantId){
        try {
          const token = localStorage.getItem('authToken');
          if(!token){
          alert("No se encontro un token de autenticacion")
          return;
          }
  
        const decoded = jwtDecode(token);
        const userId = decoded.id
  
        if(!userId){
          alert("El token no contiene un ID de usuario valido")
          return;
        }
  
          const response = await fetch(`${urlApi}/producto/getAll/${userId}`);
          if (!response.ok) {
            throw new Error("Error en la petición");
          }
          const data = await response.json();
          setProductos(data);
          const cantidadesIniciales = data.reduce((acc, plato) => ({ ...acc, [plato.nombre]: 0 }), {});
          setCantidades(cantidadesIniciales);
        } catch (error) {
          console.log(error);
        }
      }else{
        try {
          
          const response = await fetch(`${urlApi}/producto/getAll/${restaurantId}`);
          if (!response.ok) {
            throw new Error("Error en la petición");
          }
          const data = await response.json();
          setProductos(data);
          const cantidadesIniciales = data.reduce((acc, plato) => ({ ...acc, [plato.nombre]: 0 }), {});
          setCantidades(cantidadesIniciales);
        } catch (error) {
          console.log(error);
        }

      }
      
      
      
      
      
    };
    fetchProductos();
  }, [urlApi]);

  const categoriasOrdenadas = Array.from(
    new Set(productos.map(plato => plato.categoria.id))
  )
    .map(id => productos.find(plato => plato.categoria.id === id).categoria)
    .sort((a, b) => a.id - b.id);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      {/*
      <TopBanner />
      */}
            <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Menú del Restaurante</h1>
        {categoriasOrdenadas.map(categoria => (
          <section key={categoria.id} className="mb-12">
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">{categoria.nombre}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Updated grid class */}
              {productos
                .filter(plato => plato.categoria.id === categoria.id)
                .map(plato => (
                  <div key={plato.id} className="bg-white rounded-lg shadow-md overflow-hidden flex transition-transform duration-300 hover:scale-105">
                    <div className="w-1/6 min-w-[120px]"> {/* Updated image container */}
                      <img
                        src={plato.listaImagenes[0] ? `${urlApi}/images/${plato.listaImagenes[0]}` : "/img/image-not-found.png"}
                        alt={plato.nombre}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-4 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-800">{plato.nombre}</h3>
                        <p className="text-lg font-bold text-blue-600 mb-4">${plato.precio.toFixed(2)}</p> {/* Updated price margin */}
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <button
                            className="px-2 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                            onClick={() => actualizarCantidad(plato.nombre, -1)}
                          >
                            -
                          </button>
                          <span className="text-lg font-semibold text-gray-800">{cantidades[plato.nombre] || 0}</span>
                          <button
                            className="px-2 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                            onClick={() => actualizarCantidad(plato.nombre, 1)}
                          >
                            +
                          </button>
                        </div>
                        <button 
                          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                          onClick={() => agregarAlCarrito(plato)}
                        >
                          Agregar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        ))}
      </main>

      <button 
        className="fixed bottom-8 right-8 p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors z-50"
        onClick={() => setIsCarritoOpen(true)}
      >
        <ShoppingCart size={24} />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
            {totalItems}
          </span>
        )}
      </button>

      <CarritoModal 
        isOpen={isCarritoOpen} 
        onClose={() => setIsCarritoOpen(false)} 
        items={carrito} 
        onRemoveItem={removerDelCarrito} 
      />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-2xl font-bold">MenuDigital</h3>
              <p className="mt-2">Transformando la experiencia gastronómica</p>
            </div>
            <div className="text-center md:text-right">
              <p>Desarrollado por Lucas Caro</p>
              <p className="mt-2">
                <a href="https://github.com/LucasCaro97" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition duration-300">
                  GitHub
                </a>
                {' | '}
                <a href="https://www.linkedin.com/in/lucas-nahuel-caro/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition duration-300">
                  LinkedIn
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}