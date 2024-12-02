import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'

const PlanSection = () => {
  const [plans, setPlans] = useState([])
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
      } catch (error) {
        console.error('Error fetching plans:', error)
      }
    }

    fetchPlans()
  }, [])

  const handleChoosePlan = (planId) => {
    navigate(`/registro?planId=${planId}`)
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Nuestros Planes</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div key={plan.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-4">{plan.nombre}</h3>
                <p className="text-gray-600 mb-6">{plan.descripcion}</p>
                <ul className="mb-6">
                  <li className="flex items-center mb-2">
                    <Check className="text-green-500 mr-2" size={20} />
                    <span>Hasta {plan.cantidadProductos} productos</span>
                  </li>
                </ul>
                <div className="text-center">
                  <span className="text-3xl font-bold">
                    {plan.precio ? `$${plan.precio.toFixed(2)}` : 'Gratuito'}
                  </span>
                  {plan.precio && <span className="text-gray-600 ml-2">/mes</span>}
                </div>
              </div>
              <div className="px-6 pb-6">
                <button 
                  onClick={() => handleChoosePlan(plan.id)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                >
                  Elegir Plan
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PlanSection