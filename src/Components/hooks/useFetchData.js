import { useState, useEffect } from 'react';
import useFetch from './useFetch';  // Asegúrate de que el hook useFetch esté en la ruta correcta

// Hook personalizado para obtener empleados y roles
const useFetchData = (token) => {
    const { getData } = useFetch();

    // Obtener nombres de empleados    
    const fetchEmpleados = async () => {
        try {
            const response = await getData(`${import.meta.env.VITE_APP_ENDPOINT}/empleados`, token, true);
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
            const response = await getData(`${import.meta.env.VITE_APP_ENDPOINT}/auth/rol`, token, true);
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

    const fetchPermisos = async () => {
        try {
            const response = await getData(`${import.meta.env.VITE_APP_ENDPOINT}/auth/permiso`, token, true);
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

    const fetchPermisosRol = async (id) => {
        try {
            const response = await getData(`${import.meta.env.VITE_APP_ENDPOINT}/auth/rol/${id}`, token, true);

            return{
                data:response.data.data,
                status:true
            }
        } catch (error) {
            return{
                error: error,
                status: false
            }
        }
    };

    //obtener subgerencias
    const fetchSubgerencias = async () => {
        try {
            const response = await getData(`${import.meta.env.VITE_APP_ENDPOINT}/subgerencias`, token,true);
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
    }

    //obtener cargos

    const fetchCargos = async () => {
        try {
            const response = await getData(`${import.meta.env.VITE_APP_ENDPOINT}/cargos`, token,true);
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
    }

    //obtener turnos

    const fetchTurnos = async () => {
        try {
            const response = await getData(`${import.meta.env.VITE_APP_ENDPOINT}/turnos`, token,true);
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
    }

    //obtener regimen laboral

    const fetchRegimenLaboral = async () => {
        try {
            const response = await getData(`${import.meta.env.VITE_APP_ENDPOINT}/regimenlaborales`, token,true);
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
    }

    //obtener sexo

    const fetchSexos = async () => {
        try {
            const response = await getData(`${import.meta.env.VITE_APP_ENDPOINT}/sexos`, token,true);
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
    }

    //obtener jurisdiccion

    const fetchJurisdicciones = async () => {
        try {
            const response = await getData(`${import.meta.env.VITE_APP_ENDPOINT}/jurisdicciones`, token,true);
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
    }

    //obtener grado de estudio

    const fetchGradoEstudio = async () => {
        try {
            const response = await getData(`${import.meta.env.VITE_APP_ENDPOINT}/gradoestudios`, token,true);
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
    }


    //obtener lugar de trabajo

    const fetchLugarTrabajo = async () => {
        try {
            const response = await getData(`${import.meta.env.VITE_APP_ENDPOINT}/lugarestrabajos`, token,true);
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
    }

    // obtener funciones

    const fetchFunciones = async () => {
        try {
            const response = await getData(`${import.meta.env.VITE_APP_ENDPOINT}/funciones`, token,true);
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
    }






    return { fetchEmpleados, fetchRoles, fetchPermisos, fetchPermisosRol, fetchSubgerencias, fetchCargos, fetchTurnos, fetchRegimenLaboral, fetchSexos, fetchJurisdicciones, fetchGradoEstudio, fetchLugarTrabajo, fetchFunciones };
};

export default useFetchData;
