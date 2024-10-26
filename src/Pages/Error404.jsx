// Error404.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Error from '../assets/logos/Error404.webp';

const Error404 = () => {
  const navigate = useNavigate(); 

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white-500 text-red-500 px-4 w-full">
      <h1 className="text-6xl md:text-8xl font-bold">404</h1>
      <h2 className="text-4xl md:text-6xl font-bold">Oops!</h2>
      <p className="text-lg md:text-2xl mt-4 text-center font-bold">Página no encontrada.</p>
      <div className="flex items-center justify-center w-1/3 md:w-80 lg:w-96 aspect-square bg-center bg-no-repeat bg-cover mx-auto"
        style={{ backgroundImage: `url(${Error})` }}>
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

export default Error404;
