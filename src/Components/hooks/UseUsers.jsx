//import { useState, useEffect } from 'react';
import {data} from '../../helpers/SelectorUsers.js';
const UseUsers = () => {
  // Endpoint para login
/*  const endpointLogin = 'https://api.example.com/user';

  const login = (username, password) => {
    fetch(endpointLogin, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }), 
    })
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => {
        console.error('Error al obtener datos de asistencia:', error);
      });
  }, []);
  

  return { isAuthenticated, error, login };
};*/

return { data };
}

export default UseUsers;