import { useState } from 'react';

const useLogin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  // Endpoint para login
  const endpointLogin = 'https://api.example.com/user';

  
  const login = (username, password) => {
    fetch(endpointLogin, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }), 
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setIsAuthenticated(true); 
        } else {
          setIsAuthenticated(false);
          setError('Credenciales incorrectas o usuario no registrado');
        }
      })
      .catch((error) => {
        console.error('Error al iniciar sesión:', error);
        setError('Ocurrió un error al intentar iniciar sesión');
      });
  };

  return { isAuthenticated, error, login };
};

export default useLogin;
