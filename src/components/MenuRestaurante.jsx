import { useState, useEffect } from "react"
import { ShoppingCart, X } from "lucide-react"

function CarritoModal({ isOpen, onClose, items, onRemoveItem }) {
  const [nombre, setNombre] = useState("")
  const [direccion, setDireccion] = useState("")
  const [showForm, setShowForm] = useState(false)

  const total = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0)

  const handleRealizarPedido = () => {
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
          <h2 className="text-2xl font-semibold">Carrito de Compras</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        {items.length === 0 ? (
          <p>El carrito está vacío</p>
        ) : (
          <>
            <ul className="space-y-2">
              {items.map((item, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>{item.nombre} x {item.cantidad}</span>
                  <span>${(item.precio * item.cantidad).toFixed(2)}</span>
                  <button
                    onClick={() => onRemoveItem(item.nombre)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-xl font-semibold">
              Total: ${total.toFixed(2)}
            </div>
            {!showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="mt-6 w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
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
                  className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
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
      try {
        const response = await fetch(`${urlApi}/producto`);
        if (!response.ok) {
          throw new Error("Error en la petición");
        }
        const data = await response.json();
        setProductos(data);
        // Inicializa las cantidades de los productos después de obtener los datos
        const cantidadesIniciales = data.reduce((acc, plato) => ({ ...acc, [plato.nombre]: 0 }), {});
        setCantidades(cantidadesIniciales);

      } catch (error) {
        console.log(error);
      }
    };
    fetchProductos();
  }, [urlApi]);

    // Obtener categorías de productos
    const categorias = Array.from(new Set(productos.map(plato => plato.categoria.nombre)));
    
    const categoriasOrdenadas = Array.from(
      new Set(productos.map(plato => plato.categoria.id)) // Elimina duplicados basados en el id de categoría
    )
      .map(id => productos.find(plato => plato.categoria.id === id).categoria) // Mapea cada ID a su objeto de categoría
      .sort((a, b) => a.id - b.id); // Ordena por ID


  return (
    <div className="container w-full mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Menú del Restaurante</h1>
      {categoriasOrdenadas.map(categoria => (
        <div key={categoria.id} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{categoria.nombre}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {productos
              .filter(plato => plato.categoria.id === categoria.id)
              .map(plato => (
                <div key={plato.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                  <div className="p-4">
                    <img
                      src={plato.listaImagenes[0] ?  `${urlApi}/images/${plato.listaImagenes[0]}` : "/img/image-not-found.png"}
                      alt={plato.nombre}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <h3 className="text-xl font-semibold mt-2">{plato.nombre}</h3>
                    <p className="text-lg font-semibold text-gray-700 mt-1">${plato.precio.toFixed(2)}</p>
                  </div>
                  <div className="p-4 mt-auto flex justify-between items-center border-t">
                    <div className="flex items-center space-x-2">
                      <button
                        className="px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                        onClick={() => actualizarCantidad(plato.nombre, -1)}
                      >
                        -
                      </button>
                      <span className="text-lg font-semibold">{cantidades[plato.nombre] || 0}</span>
                      <button
                        className="px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                        onClick={() => actualizarCantidad(plato.nombre, 1)}
                      >
                        +
                      </button>
                    </div>
                    <button 
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                      onClick={() => agregarAlCarrito(plato)}
                    >
                      Agregar al carrito
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}

      <button 
        className="fixed bottom-4 right-4 p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors z-50"
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
    </div>
  );
}