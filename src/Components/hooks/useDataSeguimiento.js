//import { useState, useEffect } from "react";
import {datosAsistencias, meses, anios,turnos} from '../../helpers/datosSeguimientoAsistencia';

const useDataSeguimiento = () => {
  /*const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Llama a la API o base de datos para obtener los datos usando Fetch
        const response = await fetch('/api/seguimiento'); // Ajusta la URL a tu endpoint
        if (!response.ok) {
          throw new Error("Error al obtener los datos");
        }
        const data = await response.json();
        setDatos(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);*/

 // return { datos, loading, error };
 return { datosAsistencias, meses, anios,turnos };
};

export default useDataSeguimiento;
