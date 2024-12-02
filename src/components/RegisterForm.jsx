import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'

export default function RegistroForm() {
  const [username, setUsername] = useState('')
  const [direccion, setDireccion] = useState('')
  const [password, setPassword] = useState('')
  const [selectedPlan, setSelectedPlan] = useState('')
  const [commerceName, setCommerceName] = useState('')
  const [phone, setPhone] = useState('')
  const [selectedProvincia, setSelectedProvincia] = useState('')
  const [selectedLocalidad, setSelectedLocalidad] = useState('')
  const [provincias, setProvincias] = useState([])
  const [localidades, setLocalidades] = useState([])
  const [plans, setPlans] = useState([])
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('http://localhost:8080/plan')
        if (!response.ok) {
          throw new Error('Failed to fetch plans')
        }
        const data = await response.json()
        setPlans(data)
        
        // Check for preselected plan from URL
        const params = new URLSearchParams(location.search)
        const preselectedPlanId = params.get('planId')
        if (preselectedPlanId) {
          setSelectedPlan(preselectedPlanId)
        }
      } catch (error) {
        console.error('Error fetching plans:', error)
        setError('Error al cargar los planes. Por favor, intente de nuevo más tarde.')
      }
    }

    const fetchProvincias = async () => {
      try {
        const response = await fetch('http://localhost:8080/provincia')
        if (!response.ok) {
          throw new Error('Failed to fetch provincias')
        }
        const data = await response.json()
        setProvincias(data)
      } catch (error) {
        console.error('Error fetching provincias:', error)
        setError('Error al cargar las provincias. Por favor, intente de nuevo más tarde.')
      }
    }

    fetchPlans()
    fetchProvincias()
  }, [location])

  const handleProvinciaChange = async (provinciaId) => {
    setSelectedProvincia(provinciaId)
    setSelectedLocalidad('') // Reset localidad when provincia changes
    try {
      const response = await fetch(`http://localhost:8080/localidad/obtenerPorProvincia/${provinciaId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch localidades')
      }
      const data = await response.json()
      setLocalidades(data)
    } catch (error) {
      console.error('Error fetching localidades:', error)
      setError('Error al cargar las localidades. Por favor, intente de nuevo más tarde.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!username || !password || !selectedPlan || !commerceName || !phone || !selectedProvincia || !selectedLocalidad || !direccion) {
      setError('Por favor, complete todos los campos.')
      return
    }

    const registroData = {
      username,
      password,
      commerceName,
      phone: parseInt(phone, 10),
      plan: parseInt(selectedPlan, 10),
      roleRequest: {
        roleListName: ["ADMIN"]
      },
      provincia: selectedProvincia,
      ciudad: selectedLocalidad,
      direccion: direccion
    };

    try {
      const response = await fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registroData),
      })

      if (!response.ok) {
        throw new Error('Error en el registro')
      }

      const data = await response.json()
      console.log('Registro exitoso:', data)
      navigate('/login')
    } catch (error) {
      console.error('Error en el registro:', error)
      setError('Error en el registro. Por favor, intente de nuevo.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Registro de Usuario</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Nombre de usuario
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="commerceName" className="block text-sm font-medium text-gray-700">
                Nombre del Comercio
              </label>
              <div className="mt-1">
                <input
                  id="commerceName"
                  name="commerceName"
                  type="text"
                  required
                  value={commerceName}
                  onChange={(e) => setCommerceName(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Teléfono
              </label>
              <div className="mt-1">
                <input
                  id="phone"
                  name="phone"
                  type="tel" 
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} // Solo números
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="provincia" className="block text-sm font-medium text-gray-700">
                Provincia
              </label>
              <select
                id="provincia"
                name="provincia"
                required
                value={selectedProvincia}
                onChange={(e) => handleProvinciaChange(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Seleccione una provincia</option>
                {provincias.map((provincia) => (
                  <option key={provincia.id} value={provincia.id}>
                    {provincia.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="localidad" className="block text-sm font-medium text-gray-700">
                Localidad
              </label>
              <select
                id="localidad"
                name="localidad"
                required
                value={selectedLocalidad}
                onChange={(e) => setSelectedLocalidad(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Seleccione una localidad</option>
                {localidades.map((localidad) => (
                  <option key={localidad.id} value={localidad.id}>
                    {localidad.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">
                Direccion
              </label>
              <div className="mt-1">
                <input
                  id="direccion"
                  name="direccion"
                  type="text"
                  autoComplete="direccion"
                  required
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="plan" className="block text-sm font-medium text-gray-700">
                Plan
              </label>
              <select
                id="plan"
                name="plan"
                required
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Seleccione un plan</option>
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.nombre} - {plan.precio ? `$${plan.precio.toFixed(2)}` : 'Gratuito'}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Registrarse
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}