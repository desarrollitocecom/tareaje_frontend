import React from "react";
import { useNavigate } from "react-router-dom";
import Mantenimiento from "../../src/assets/logos/Mantenimiento.webp"; 
const Mantenimiento = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-yellow-600 px-4 w-full">
      <h1 className="text-5xl md:text-7xl font-bold">Sitio en Mantenimiento</h1>
      <p className="text-lg md:text-2xl mt-4 text-center font-bold">
        Estamos trabajando para brindarte una mejor experiencia.
      </p>
      <div
        className="flex items-center justify-center w-1/2 md:w-80 lg:w-96 aspect-square bg-center bg-no-repeat bg-cover mx-auto mt-6"
        style={{ backgroundImage: `url(${Mantenimiento})` }} // Imagen de construcción
      ></div>
      <button
        onClick={() => navigate(-1)} // Navegar a la página anterior
        className="mt-6 px-6 py-2 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-700 transition duration-300"
      >
        Volver
      </button>
    </div>
  );
};

export default Mantenimiento;
