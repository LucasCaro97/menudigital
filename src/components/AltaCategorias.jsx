import React, { useState, useEffect } from 'react'
import { PlusCircle } from 'lucide-react'

export default function AltaCategorias() {
  const [categorias, setCategorias] = useState([])
  const [nuevaCategoria, setNuevaCategoria] = useState('')
  const [error, setError] = useState('')
  const urlApi = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchCategorias()
  }, [])

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('authToken');

    if (!nuevaCategoria.trim()) {
      setError('El nombre de la categoría no puede estar vacío')
      return
    }

    try {
      const response = await fetch(`${urlApi}/categoria`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }, 
        
        body: JSON.stringify({ nombre: nuevaCategoria }),
      })
      if (!response.ok) {
        throw new Error('Error al crear la categoría')
      }
      await fetchCategorias()
      setNuevaCategoria('')
      setError('')
    } catch (error) {
      setError('Error al crear la categoría')
      console.error('Error:', error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Alta de Categorías</h1>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={nuevaCategoria}
            onChange={(e) => setNuevaCategoria(e.target.value)}
            placeholder="Nombre de la nueva categoría"
            className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center"
          >
            <PlusCircle className="mr-2" size={20} />
            Agregar
          </button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categorias.map((categoria) => (
              <tr key={categoria.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {categoria.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {categoria.nombre}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}