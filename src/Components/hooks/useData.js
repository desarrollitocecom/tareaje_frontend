
//import { useState, useEffect } from 'react';
import {cargos, turnos,data} from '../../helpers/SelectorCargo_Turno';


const useData = () => {
  //const [data, setData] = useState([]);


  /*
  const [cargos, setCargos] = useState([]);
  const [turnos, setTurnos] = useState([]);
  */

  // Endpoints 
 // const endpointAsistencia = 'https://api.example.com/asistencia';

  /*
  const endpointCargos = 'https://api.example.com/cargos';
  const endpointTurnos = 'https://api.example.com/turnos';
  */


  // Obtener datos de asistencia
  /*
  useEffect(() => {
    fetch(endpointAsistencia)
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => {
        console.error('Error al obtener datos de asistencia:', error);
      });
  }, []);
  */

  // Obtener cargos desde la base de datos
  /*
  useEffect(() => {
    fetch(endpointCargos)
      .then((response) => response.json())
      .then((data) => setCargos(data))
      .catch((error) => {
        console.error('Error al obtener los cargos:', error);
      });
  }, []);
  */

  // Obtener turnos desde la base de datos

  /*
  useEffect(() => {
    fetch(endpointTurnos)
      .then((response) => response.json())
      .then((data) => setTurnos(data))
      .catch((error) => {
        console.error('Error al obtener los turnos:', error);
      });
  }, []);
  */

  return { data, cargos, turnos };
};

export default useData;
