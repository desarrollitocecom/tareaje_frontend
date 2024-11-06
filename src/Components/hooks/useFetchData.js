import { useState, useEffect } from 'react';
import useFetch from './useFetch';  // Asegúrate de que el hook useFetch esté en la ruta correcta

// Hook personalizado para obtener empleados y roles
const useFetchData = (token) => {
    const { getData } = useFetch();
    const [empleados, setEmpleados] = useState([]);
    const [roles, setRoles] = useState([]);

    // Obtener nombres de empleados    
    const fetchEmpleados = async () => {
        try {
            const response = await getData(`${import.meta.env.VITE_APP_ENDPOINT}/empleados`, token);
            setEmpleados(response.data.data.data);
        } catch (error) {
            console.error('Error al obtener empleados:', error);
        }
    };

    // Obtener roles
    const fetchRoles = async () => {
        try {
            const response = await getData(`${import.meta.env.VITE_APP_ENDPOINT}/auth/rol`, token);
            setRoles(response.data.data.data);
        } catch (error) {
            console.error('Error al obtener roles:', error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchEmpleados();
            fetchRoles();
        }
    }, [token]);

    return { empleados, roles };
};

export default useFetchData;
