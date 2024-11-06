import { useState, useEffect } from 'react';
import useFetch from './useFetch';  // Asegúrate de que el hook useFetch esté en la ruta correcta

// Hook personalizado para obtener empleados y roles
const useFetchData = (token) => {
    const { getData } = useFetch();

    // Obtener nombres de empleados    
    const fetchEmpleados = async () => {
        try {
            const response = await getData(`${import.meta.env.VITE_APP_ENDPOINT}/empleados`, token);
            return{
                data: response.data.data.data,
                status: false
            }
        } catch (error) {
            return{
                error: error,
                status: false
            }
        }
    };

    // Obtener roles
    const fetchRoles = async () => {
        try {
            const response = await getData(`${import.meta.env.VITE_APP_ENDPOINT}/auth/rol`, token);
            return{
                data:response.data.data.data,
                status:false
            }
        } catch (error) {
            return{
                error: error,
                status: false
            }
        }
    };

    return { fetchEmpleados, fetchRoles };
};

export default useFetchData;
