import React, { useState, useEffect } from 'react'
import { PlusCircle, X, Edit, ChevronDown, ChevronUp } from 'lucide-react'

export default function AltaProductos() {
  const [productosPorCategoria, setProductosPorCategoria] = useState({})
  const [categorias, setCategorias] = useState([])
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    categoria: '',
    descripcion: '',
    precio: '',
    listaImagenes: []
  })
  const [error, setError] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProductId, setEditingProductId] = useState(null)
  const [expandedCategories, setExpandedCategories] = useState({})
  const urlApi = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchProductos()
    fetchCategorias()
  }, [])

  const fetchProductos = async () => {
    try {
      const response = await fetch(`${urlApi}/producto`)
      if (!response.ok) {
        throw new Error('Error al obtener los productos')
      }
      const data = await response.json()
      const productosAgrupados = data.reduce((acc, producto) => {
        const categoriaId = producto.categoria.id
        if (!acc[categoriaId]) {
          acc[categoriaId] = []
        }
        acc[categoriaId].push(producto)
        return acc
      }, {})
      setProductosPorCategoria(productosAgrupados)
      setExpandedCategories(Object.keys(productosAgrupados).reduce((acc, categoriaId) => {
        acc[categoriaId] = true
        return acc
      }, {}))
    } catch (error) {
      setError('Error al cargar los productos')
      console.error('Error:', error)
    }
  }

  const fetchCategorias = async () => {
    try {
      const response = await fetch(`${urlApi}/categoria`)
      if (!response.ok) {
        throw new Error('Error al obtener las categorías')
      }
      const data = await response.json()
      setCategorias(data)
    } catch (error) {
      setError('Error al cargar las categorías')
      console.error('Error:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNuevoProducto(prev => ({ ...prev, [name]: value }))
  }

  const handleImagenChange = (e) => {
    const files = Array.from(e.target.files)
    setNuevoProducto(prev => ({
      ...prev,
      listaImagenes: [...prev.listaImagenes, ...files.map(file => ({
        file,
        url: URL.createObjectURL(file),
        nombre: file.name,
        isNew: true
      }))]
    }))
  }

  const handleImagenRemove = async (index, imagenUrl) => {
    const imagen = nuevoProducto.listaImagenes[index]
    if (imagen.isNew) {
      setNuevoProducto(prev => ({
        ...prev,
        listaImagenes: prev.listaImagenes.filter((_, i) => i !== index)
      }))
    } else {
      try {
        const response = await fetch(`${urlApi}/producto/${editingProductId}/deleteImage/${imagenUrl}`, {
          method: 'DELETE',
        })
        if (!response.ok) {
          throw new Error('Error al eliminar la imagen')
        }
        setNuevoProducto(prev => ({
          ...prev,
          listaImagenes: prev.listaImagenes.filter((_, i) => i !== index)
        }))
      } catch (error) {
        setError('Error al eliminar la imagen')
        console.error('Error:', error)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!nuevoProducto.nombre || !nuevoProducto.categoria || !nuevoProducto.precio) {
      setError('Por favor, complete todos los campos obligatorios')
      return
    }
    try {
      const formData = new FormData()
      formData.append('nombre', nuevoProducto.nombre)
      formData.append('categoria', nuevoProducto.categoria)
      formData.append('descripcion', nuevoProducto.descripcion)
      formData.append('precio', nuevoProducto.precio)
      nuevoProducto.listaImagenes.forEach((imagen, index) => {
        if (imagen.isNew) {
          formData.append(`imagen`, imagen.file)
        } else {
          formData.append(`imagenExistente`, imagen.url)
        }
      })

      const url = editingProductId 
        ? `${urlApi}/producto/${editingProductId}` 
        : `${urlApi}/producto`
      const method = editingProductId ? 'PUT' : 'POST'

      const token = localStorage.getItem('authToken');

      const response = await fetch(url, {
        method: method,
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`, 
        }
      })
      if (!response.ok) {
        throw new Error('Error al crear/editar el producto')
      }
      await fetchProductos()
      setNuevoProducto({
        nombre: '',
        categoria: '',
        descripcion: '',
        precio: '',
        listaImagenes: []
      })
      setError('')
      setIsFormOpen(false)
      setEditingProductId(null)
    } catch (error) {
      setError('Error al crear/editar el producto')
      console.error('Error:', error)
    }
  }

  const handleEdit = (producto) => {
    setNuevoProducto({
      nombre: producto.nombre,
      categoria: producto.categoria.id,
      descripcion: producto.descripcion,
      precio: producto.precio,
      listaImagenes: producto.listaImagenes.map(imagen => ({
        url: imagen,
        nombre: imagen.split('/').pop(),
        isNew: false
      }))
    })
    setEditingProductId(producto.id)
    setIsFormOpen(true)
  }

  const toggleCategoryExpansion = (categoriaId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoriaId]: !prev[categoriaId]
    }))
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Alta de Productos</h1>
      
      <button
        onClick={() => {
          setNuevoProducto({
            nombre: '',
            categoria: '',
            descripcion: '',
            precio: '',
            listaImagenes: []
          })
          setEditingProductId(null)
          setIsFormOpen(true)
        }}
        className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
      >
        <PlusCircle className="mr-2 h-4 w-4" /> Nuevo Producto
      </button>

      {isFormOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">{editingProductId ? 'Editar Producto' : 'Nuevo Producto'}</h3>
              <form onSubmit={handleSubmit} className="mt-2 text-left">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                    Nombre
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="nombre"
                    type="text"
                    placeholder="Nombre del producto"
                    name="nombre"
                    value={nuevoProducto.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="categoria">
                    Categoría
                  </label>
                  <select
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="categoria"
                    name="categoria"
                    value={nuevoProducto.categoria}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccione una categoría</option>
                    {categorias.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="descripcion">
                    Descripción
                  </label>
                  <textarea
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="descripcion"
                    placeholder="Descripción del producto"
                    name="descripcion"
                    value={nuevoProducto.descripcion}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="precio">
                    Precio
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="precio"
                    type="number"
                    step="0.01"
                    placeholder="Precio del producto"
                    name="precio"
                    value={nuevoProducto.precio}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Imágenes
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={handleImagenChange}
                    className="mb-2"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    {nuevoProducto.listaImagenes.map((imagen, index) => (
                      <div key={index} className="relative">
                        <img
                          src={imagen.isNew ? imagen.url : `http://localhost:8080/images/${imagen.url}`}
                          alt={`Imagen ${index + 1}`}
                          className="w-full h-32 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => handleImagenRemove(index, imagen.url)}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 m-1 hover:bg-red-600 focus:outline-none"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
                <div className="flex items-center justify-between">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                  >
                    {editingProductId ? 'Actualizar Producto' : 'Crear Producto'}
                  </button>
                  <button
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {Object.entries(productosPorCategoria).map(([categoriaId, productos]) => {
        const categoria = categorias.find(cat => cat.id === parseInt(categoriaId))
        return (
          <div key={categoriaId} className="mb-8">
            <div 
              className="flex justify-between items-center bg-gray-200 p-4 rounded-t-lg cursor-pointer"
              onClick={() => toggleCategoryExpansion(categoriaId)}
            >
              <h2 className="text-xl font-bold">{categoria ? categoria.nombre : 'Categoría Desconocida'}</h2>
              {expandedCategories[categoriaId] ? <ChevronUp /> : <ChevronDown />}
            </div>
            {expandedCategories[categoriaId] && (
              <div className="bg-white shadow-md rounded-b-lg px-8 pt-6 pb-8 mb-4 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Descripción</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Imágenes</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {productos.map((producto) => (
                      <tr key={producto.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">{producto.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{producto.nombre}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">{producto.descripcion}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${producto.precio}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">{producto.listaImagenes.length} imágenes</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEdit(producto)}
                            className="text-indigo-600 hover:text-indigo-900 flex items-center"
                          >
                            <Edit className="h-4 w-4 mr-2" /> Editar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}