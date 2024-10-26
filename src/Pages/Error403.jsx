import React from 'react';
import { useNavigate } from 'react-router-dom';
import Error from '../assets/logos/Error403.webp';

const Error403 = () => {
  const navigate = useNavigate(); 

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white-500 text-red-500 px-4 w-full">
      <h1 className="text-6xl md:text-8xl font-bold">403</h1>
      <p className="text-lg md:text-2xl mt-4 text-center">No tienes permiso para acceder a este recurso.</p>
      <div className="flex flex-col items-center justify-center mt-8">
        <img
          src={Error}
          alt="Error"
          className="w-full max-w-xs md:max-w-md lg:max-w-lg mx-auto h-auto opacity-100"
        />
      </div>
      <button
        onClick={() => navigate(-1)} // Navegar a la página anterior
        className="mt-6 px-6 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-700 transition duration-300"
      >
        Volver
      </button>
    </div>
  );
};

export default Error403;
