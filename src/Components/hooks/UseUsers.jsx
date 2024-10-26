
//import { useState, useEffect } from 'react';
import {cargos, turnos,data} from '../../helpers/SelectorCargo_Turno';

const useData = () => {
  //const [data, setData] = useState([]);


  /*
  const [cargos, setCargos] = useState([]);
  const [turnos, setTurnos] = useState([]);
  */

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

export default useData;
