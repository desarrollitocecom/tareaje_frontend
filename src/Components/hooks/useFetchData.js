import { useState, useEffect } from 'react';
import useFetch from './useFetch';  // Asegúrate de que el hook useFetch esté en la ruta correcta
import axios from 'axios';

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

    const fetchPDF = async (path) => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_APP_ENDPOINT}/${path}`,
            {
              headers: {
                Authorization: `Bearer___${token}`,
              },
              responseType: 'blob',
            }
          );
    
          if (!response.data) {
            throw new Error('El archivo PDF no se pudo obtener.');
          }
          const pdfURL = URL.createObjectURL(response.data);

          return pdfURL;
        } catch (error) {
          console.error('Error al obtener el archivo PDF:', error);
        }
      };






    return { fetchEmpleados, fetchRoles, fetchPermisos, fetchPermisosRol, fetchSubgerencias, fetchCargos, fetchTurnos, fetchRegimenLaboral, fetchSexos, fetchJurisdicciones, fetchGradoEstudio, fetchLugarTrabajo, fetchFunciones, fetchPDF };
};

export default useFetchData;
