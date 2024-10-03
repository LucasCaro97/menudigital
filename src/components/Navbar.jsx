import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <nav className="bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="font-bold text-xl">
              Como en Ksa Bodegon
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/alta-categorias" className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Alta de Categorías
              </Link>
              <Link to="/alta-platos" className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Alta de Platos
              </Link>
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Abrir menú principal</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/alta-categorias" className="hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium">
              Alta de Categorías
            </Link>
            <Link to="/alta-platos" className="hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium">
              Alta de Platos
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}