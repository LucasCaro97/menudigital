import React, { useState, useEffect } from "react";
import {
  User,
  Edit,
  Save,
  X,
  ShoppingBag,
  TrendingUp,
  BarChart2,
  Pizza,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Dashboard = () => {
  const [user, setUser] = useState({
    id: "",
    razonSocial: "",
    telefono: "",
    logo: "",
    provincia: {
      id: "",
      nombre: "",
    },
    localidad: {
      id: "",
      nombre: "",
    },
    direccion: "",
    plan: {
      id: "",
      nombre: "",
      descripcion: "",
      cantidadProductos: "",
      precio: "",
    },
  });
  const [planList, setPlanList] = useState([]);
  const [provinciaList, setProvinciaList] = useState([]);
  const [localidadList, setLocalidadList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [monthlyOrders, setMonthlyOrders] = useState(0);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [profileImg, setProfileImg] = useState();
  const [cantidadProductos, setCantidadProductos] = useState();

  const urlApi = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/unauthorized");
      }
      const decoded = jwtDecode(token);
      const idUser = decoded.id;
      const response = await fetch(`${urlApi}/usuario/${idUser}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Error al buscar al usuario");
      }
      const data = await response.json();
      setUser(data);
      fetchCantidadProductos(data.id)
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCantidadProductos = async (userId) => {
    try {
      const response = await fetch(`${urlApi}/producto/getAll/${userId}`);
      if (!response.ok) {
        throw new Error("Error en la petición");
      }
      const data = await response.json();
      setCantidadProductos(data.length)
    } catch (error) {
      console.log(error);
    }
  }

  const fetchPlanData = async () => {
    try {
      const response = await fetch(`${urlApi}/plan`);
      if (!response.ok) {
        throw new Error("Error al buscar planes");
      }
      const data = await response.json();
      setPlanList(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProvinciaData = async () => {
    try {
      const response = await fetch(`${urlApi}/provincia`);
      if (!response.ok) {
        throw new Error("Error al buscar provincias");
      }
      const data = await response.json();
      setProvinciaList(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchLocalidadData = async (idProvincia) => {
    try {
      const response = await fetch(
        `${urlApi}/localidad/obtenerPorProvincia/${idProvincia}`
      );
      if (!response.ok) {
        throw new Error("Error al buscar localidades");
      }
      const data = await response.json();
      setLocalidadList(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedUser(user);
    fetchPlanData();
    fetchProvinciaData();
    fetchLocalidadData(user.provincia.id);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("No se encontró el token de autenticación o ha vendido.");
        navigate("/unauthorized");
        return;
      }
      const decoded = jwtDecode(token);
      const idUser = decoded.id;

      const formData  = new FormData();

      formData.append("razonSocial", editedUser.razonSocial);
      formData.append("telefono", editedUser.telefono);
      formData.append("idProvincia", editedUser.provincia.id);
      formData.append("idLocalidad", editedUser.localidad.id);
      formData.append("idPlan", editedUser.plan.id);
      formData.append("direccion", editedUser.direccion);
      if(profileImg){
        formData.append("imagenPerfil", profileImg);
      }

      const response = await fetch(`${urlApi}/usuario/${idUser}`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`, 
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(
          `Error al actualizar el usuario: ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Usuario actualizado con exito", data);
      await fetchUserData();
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser(user);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "plan") {
      //Busco el objeto completo del plan en la lista
      const selectedPlan = planList.find((plan) => plan.id === Number(value));
      setEditedUser((prev) => ({
        ...prev,
        plan: selectedPlan, //Actualizo el plan completo
      }));
    } else if (name === "provincia") {
      fetchLocalidadData(value);
      const selectedProvincia = provinciaList.find(
        (provincia) => provincia.id === Number(value)
      );
      setEditedUser((prev) => ({
        ...prev,
        provincia: selectedProvincia,
        localidad: { id: "", nombre: "" },
      }));
    } else if (name === "localidad") {
      const selectedLocalidad = localidadList.find(
        (localidad) => localidad.id === Number(value)
      );
      setEditedUser((prev) => ({
        ...prev,
        localidad: selectedLocalidad,
      }));
    } else {
      setEditedUser((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0]
    if(file){
      setProfileImg(file)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {/* User Information Card */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              User Information
            </h2>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <Edit size={20} className="mr-1" />
                Edit
              </button>
            ) : (
              <div>
                <button
                  onClick={handleSave}
                  className="flex items-center text-green-600 hover:text-green-800 mr-2"
                >
                  <Save size={20} className="mr-1" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center text-red-600 hover:text-red-800"
                >
                  <X size={20} className="mr-1" />
                  Cancel
                </button>
              </div>
            )}
          </div>
          {!isEditing ? (
            <div className="sm:flex">
              <div className="mx-2 w-full sm:w-1/6 ">
              
                <img src={user.logo ? `${urlApi}/images/${user.logo}` : "/img/image-not-found.png"} alt="" />
              </div>
              <div className="flex flex-col gap-3 justify-center mt-4">
                <p>
                  <strong>Razon Social:</strong> {user.razonSocial}
                </p>
                <p>
                  <strong>Telefono:</strong> {user.telefono}
                </p>
                <p>
                  <strong>Provincia:</strong> {user.provincia.nombre}
                </p>
                <p>
                  <strong>Localidad:</strong> {user.localidad.nombre}
                </p>
                <p>
                  <strong>Plan:</strong>{" "}
                  {user.plan.nombre + " - $" + user.plan.precio + " - " + user.plan.cantidadProductos + " productos"}
                </p>
              </div>
            </div>
          ) : (
            <form className="flex flex-col items-center md:flex-row">
              <div className="flex flex-col w-1/2  mx-2">
                <img src={user.logo ? `${urlApi}/images/${user.logo}` : "/img/image-not-found.png"} alt="" />
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Imagenes
                  </label>
                  <input
                    type="file"
                    onChange={handleImagenChange}
                    className="mb-2 file:flex flex-col text-sm"
                  />
                </div>
              </div>
              <div className="flex-col w-full px-5">
                <div className="mb-4">
                  <label
                    htmlFor="razonSocial"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Razon Social
                  </label>
                  <input
                    type="text"
                    id="razonSocial"
                    name="razonSocial"
                    value={editedUser.razonSocial}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="telefono"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Telefono
                  </label>
                  <input
                    type="text"
                    id="telefono"
                    name="telefono"
                    value={editedUser.telefono}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="provincia"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Provincia
                  </label>
                  <select
                    id="provincia"
                    name="provincia"
                    value={editedUser.provincia.id}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="" disabled>
                      Seleccione una provincia
                    </option>
                    {provinciaList.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="provincia"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Localidad
                  </label>
                  <select
                    id="localidad"
                    name="localidad"
                    value={editedUser.localidad.id}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="" disabled>
                      Seleccione una localidad
                    </option>
                    {localidadList.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="plan"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Plan
                  </label>
                  <select
                    id="plan"
                    name="plan"
                    value={editedUser.plan.id}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="" disabled>
                      Seleccione un plan
                    </option>
                    {planList.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.nombre + " - $" + item.precio + " - " + item.cantidadProductos + " productos"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Monthly Orders Card */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Productos Creados
            </h2>
            <div className="flex items-center">
              <Pizza size={48} className="text-blue-500 mr-4" />
              <span className="text-4xl font-bold text-gray-700">
                {cantidadProductos}
              </span>
            </div>
          </div>

          {/* Best Selling Products Card */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Proximamente recepcion de pedidos
            </h2>
            <div className="flex items-center">
              <ShoppingBag size={48} className="text-blue-500 mr-4" />
              <span className="text-4xl font-bold text-gray-700">
                ---
              </span>
            </div>
          </div>
        </div>

        {/* Placeholder for Future Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Best Selling Products
            </h2>
            <div className="flex items-center justify-center h-48 bg-gray-200 rounded">
              <TrendingUp size={48} className="text-gray-400" />
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Customer Satisfaction
            </h2>
            <div className="flex items-center justify-center h-48 bg-gray-200 rounded">
              <BarChart2 size={48} className="text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
