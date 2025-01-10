import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Utensils,
  Clock,
  CreditCard,
  Smartphone,
  Search,
  Star,
  MapPin,
  Phone,
  Pizza,
} from "lucide-react";
import PlanSection from "../components/PlanSection";

const LandingPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [provinceList, setProvinceList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const totalSlides = 3;
  const restaurantsRef = useRef(null);
  const carouselIntervalRef = useRef(null);
  const navigate = useNavigate();
  const urlApi = import.meta.env.VITE_API_URL;
  const [hasSearched, setHasSearched] = useState(false);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  useEffect(() => {
    const scrollRestaurants = () => {
      if (restaurantsRef.current) {
        restaurantsRef.current.scrollLeft += 1;
        if (
          restaurantsRef.current.scrollLeft >=
          restaurantsRef.current.scrollWidth / 2
        ) {
          restaurantsRef.current.scrollLeft = 0;
        }
      }
    };

    const restaurantsIntervalId = setInterval(scrollRestaurants, 50);

    carouselIntervalRef.current = setInterval(nextSlide, 4000);

    return () => {
      clearInterval(restaurantsIntervalId);
      if (carouselIntervalRef.current) {
        clearInterval(carouselIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const fetchProvincias = async () => {
      try {
        const response = await fetch(`${urlApi}/provincia`);
        if (!response.ok) {
          throw new Error("Error en la solicitud " + response.status);
        }

        const data = await response.json();
        setProvinceList(data);
      } catch (error) {
        console.log("Hubo un problema con la solicitud: " + error);
      }
    };

    fetchProvincias();
  }, []);

  const resetCarouselInterval = () => {
    if (carouselIntervalRef.current) {
      clearInterval(carouselIntervalRef.current);
    }
    carouselIntervalRef.current = setInterval(nextSlide, 4000);
  };

  const handleManualSlideChange = (direction) => {
    if (direction === "next") {
      nextSlide();
    } else {
      prevSlide();
    }
    resetCarouselInterval();
  };

  const handleProvinceChange = async (e) => {
    const provinciaId = e.target.value;
    setSelectedProvince(provinciaId);
    setSelectedCity("");
    setSearchResults([]);
    setHasSearched(false);

    if (provinciaId) {
      try {
        const response = await fetch(
          `${urlApi}/localidad/obtenerPorProvincia/${provinciaId}`
        );
        if (!response.ok) {
          throw new Error("Error en la solicitud " + response.status);
        }
        const data = await response.json();
        setCityList(data);
      } catch (error) {
        console.log("Hubo un problema al obtener las localidades: " + error);
        setCityList([]);
      }
    } else {
      setCityList([]);
    }
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    setSearchResults([]);
    setHasSearched(false);
  };

  const handleSearch = () => {
    setIsSearching(true);
    setHasSearched(true);
    setTimeout(async () => {
      const response = await fetch(
        `${urlApi}/usuario/localidad/${selectedCity}`
      );
      if (!response.ok) {
        throw new Error("Error en la solicitud " + response.status);
      }
      const data = await response.json();
      setSearchResults(data);
      setIsSearching(false);
    }, 1500);
  };

  const handleCardClick = (razonSocial) => {
    // Redirigir a /menu y pasar el ID como estado
    navigate(`/menu/${encodeURIComponent(razonSocial)}`);
  };

  const carouselItems = [
    {
      image: "/img/wpmenu1.jpg?height=400&width=800",
      title: "Menús Digitales Interactivos",
      description:
        "Transforma la experiencia de tus clientes con nuestros menús digitales fáciles de usar.",
    },
    {
      image: "/img/wpmenu2.jpg?height=400&width=800",
      title: "Gestión Eficiente de Pedidos",
      description:
        "Optimiza tus operaciones con nuestra plataforma de gestión de pedidos en tiempo real.",
    },
    {
      image: "/img/wpmenu3.jpg?height=400&width=800",
      title: "Análisis de Datos Avanzados",
      description:
        "Toma decisiones informadas con nuestras herramientas de análisis de datos para restaurantes.",
    },
  ];

  const benefits = [
    {
      icon: <Utensils className="w-12 h-12 text-blue-500" />,
      title: "Menús Personalizables",
      description:
        "Crea y actualiza fácilmente tus menús con nuestra intuitiva interfaz.",
    },
    {
      icon: <Clock className="w-12 h-12 text-blue-500" />,
      title: "Ahorro de Tiempo",
      description:
        "Reduce el tiempo de espera y mejora la eficiencia de tu servicio.",
    },
    {
      icon: <CreditCard className="w-12 h-12 text-blue-500" />,
      title: "Aumento de Ventas",
      description:
        "Impulsa tus ventas con recomendaciones personalizadas y promociones.",
    },
    {
      icon: <Smartphone className="w-12 h-12 text-blue-500" />,
      title: "Acceso Móvil",
      description:
        "Gestiona tu restaurante desde cualquier lugar con nuestra app móvil.",
    },
  ];

  const restaurants = [
    {
      name: "La Trattoria",
      image: "/img/restaurant_logo.png?height=200&width=200",
      cuisine: "Italiana",
    },
    {
      name: "Sushi Zen",
      image: "/img/restaurant_logo.png?height=200&width=200",
      cuisine: "Japonesa",
    },
    {
      name: "El Asador",
      image: "/img/restaurant_logo.png?height=200&width=200",
      cuisine: "Argentina",
    },
    {
      name: "Le Petit Bistro",
      image: "/img/restaurant_logo.png?height=200&width=200",
      cuisine: "Francesa",
    },
    {
      name: "Taco Loco",
      image: "/img/restaurant_logo.png?height=200&width=200",
      cuisine: "Mexicana",
    },
    {
      name: "Curry House",
      image: "/img/restaurant_logo.png?height=200&width=200",
      cuisine: "India",
    },
    {
      name: "The Burger Joint",
      image: "/img/restaurant_logo.png?height=200&width=200",
      cuisine: "Americana",
    },
    {
      name: "Dim Sum Palace",
      image: "/img/restaurant_logo.png?height=200&width=200",
      cuisine: "China",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section / Carousel */}
      <section className="relative bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-16">
          <div className="relative h-64 sm:h-80 lg:h-96">
            {carouselItems.map((item, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                      {item.title}
                    </h2>
                    <p className="text-lg sm:text-xl mb-8">
                      {item.description}
                    </p>
                    <Link
                      to="/login"
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 inline-block"
                    >
                      Empieza Ahora
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => handleManualSlideChange("prev")}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-30 rounded-full p-2 hover:bg-opacity-50 transition duration-300"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={() => handleManualSlideChange("next")}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-30 rounded-full p-2 hover:bg-opacity-50 transition duration-300"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Beneficios de Nuestra Plataforma
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md text-center"
              >
                <div className="flex justify-center mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Restaurant Search Section */}
      <section className="py-16  bg-blue-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Encuentra Restaurantes Cerca de Ti
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <select
                value={selectedProvince}
                onChange={handleProvinceChange}
                className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecciona una provincia</option>
                {provinceList.map((province) => (
                  <option key={province.id} value={province.id}>
                    {province.nombre}
                  </option>
                ))}
              </select>
              <select
                value={selectedCity}
                onChange={handleCityChange}
                className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!selectedProvince}
              >
                <option value="">Selecciona una ciudad</option>
                {selectedProvince &&
                  cityList.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.nombre}
                    </option>
                  ))}
              </select>
              <button
                onClick={handleSearch}
                className="flex-none bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 flex items-center justify-center"
                disabled={!selectedProvince || !selectedCity || isSearching}
              >
                {isSearching ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Search className="mr-2" size={20} />
                    Buscar
                  </>
                )}
              </button>
            </div>

            {/* Search Results */}
            {!isSearching && ( 
              <>
                {hasSearched && searchResults.length === 0 && (
                  <div className="text-center mt-8 text-gray-600">
                    No hay locales registrados en esta ubicación.
                  </div>
                )}
                {searchResults.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                  {searchResults.map((restaurant) => (
                    <div
                    key={restaurant.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 cursor-pointer"
                    onClick={() => handleCardClick(restaurant.razonSocial)}
                  >
                      <img src={restaurant.logo ? `${urlApi}/images/${restaurant.logo}` : '/img/restaurant_logo.png?height=200&width=200'} alt={restaurant.razonSocial} className="w-full h-48 object-cover" />
                      
                      <div className="p-4">
                        <h3 className="text-xl font-semibold mb-2">{restaurant.razonSocial}</h3>
                        <p className="text-gray-600 mb-2">Argentina</p>
                        <div className="flex items-center mb-2">
                          {/**
                           <Star className="text-yellow-400 mr-1" size={16} />
                           */}
                        </div>
                        <div className="flex items-center mb-2">
                          <MapPin className="text-gray-500 mr-2" size={16} />
                          <span className="text-sm">{restaurant.direccion}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="text-gray-500 mr-2" size={16} />
                          <span className="text-sm">{restaurant.telefono}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>  
                )}
              </>
            )}
            {isSearching && <div className="text-center mt-8">Buscando...</div>}
          </div>
        </div>
      </section>

      {/* Associated Restaurants Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Restaurantes Asociados
          </h2>
          <div
            ref={restaurantsRef}
            className="flex overflow-x-hidden space-x-8 pb-4"
          >
            {restaurants.concat(restaurants).map((restaurant, index) => (
              <div key={index} className="flex-none w-64">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">
                      {restaurant.name}
                    </h3>
                    <p className="text-gray-600">{restaurant.cuisine}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plan Section */}
      <PlanSection />

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
                <a
                  href="https://github.com/LucasCaro97"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition duration-300"
                >
                  GitHub
                </a>
                {" | "}
                <a
                  href="https://www.linkedin.com/in/lucas-nahuel-caro/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition duration-300"
                >
                  LinkedIn
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
