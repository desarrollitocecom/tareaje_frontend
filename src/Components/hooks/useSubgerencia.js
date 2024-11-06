// src/hooks/useSubgerencia.js
import { useState, useEffect } from 'react';
import useFetch from '../../Components/hooks/useFetch';
import { useSelector } from 'react-redux';

const useSubgerencia = (initialPage = 1, initialLimit = 10) => {
    const { getData } = useFetch();
    const { token } = useSelector((state) => state.auth);
    const [subgerencias, setSubgerencias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(initialPage);
    const [limitRows, setLimitRows] = useState(initialLimit);

    useEffect(() => {
        const fetchSubgerencias = async () => {
            setLoading(true);

            try {
                const response = await getData(
                    `${import.meta.env.VITE_APP_ENDPOINT}/subgerencias?page=${page}&limit=${limitRows}`, 
                    token
                );

                if (response && response.data && response.data.data) {
                    setCount(response.data.data.totalCount || 0);

                    const dataFormated = response.data.data.data.map((item) => ({
                        id: item.id,
                        nombre: item.nombre,
                    }));
                    setSubgerencias(dataFormated);
                    
                } else {
                    console.warn('Estructura de datos inesperada:', response);
                    setSubgerencias([]);
                }
            } catch (error) {
                console.error('Error al cargar subgerencias:', error);
                setSubgerencias([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSubgerencias();
    }, [getData, token, page, limitRows]);

    return { subgerencias, loading, count, page, setPage, limitRows, setLimitRows };
};

export default useSubgerencia;
