import React from 'react'

const Footer = () => {
  return (
    <div>
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
  )
}

export default Footer
