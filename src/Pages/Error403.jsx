import React from 'react';
import Error from '../assets/logos/Error.png';

const Error403 = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-500 text-white px-4">
      <h1 className="text-6xl md:text-8xl font-bold">403</h1>
      <p className="text-lg md:text-2xl mt-4 text-center">No tienes permiso para acceder a este recurso.</p>
      <div className="flex flex-col items-center justify-center mt-8">
        <img
          src={Error}
          alt="Error"
          className="w-full max-w-xs md:max-w-md lg:max-w-lg mx-auto h-auto opacity-100"
        />
      </div>
    </div>
  );
};

export default Error403;
