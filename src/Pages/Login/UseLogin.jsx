import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../Redux/Slices/AuthSlice';
const UseLogin = () => {
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = async (credentials) => {
        setLoading(true);
        setError(null);
        try {
            // Reemplaza la URL con la de tu API de autenticación
            const response = await axios.post(`${import.meta.env.VITE_APP_ENDPOINT}/login/signin`, credentials);
            const token = response.data.token;

            const dataUser = await getUserData(token);

            dispatch(loginSuccess({ user: dataUser, token: token }));
            return response.data.data
        } catch (err) {

            setError(err.response?.data?.message || 'Error de inicio de sesión');
            return null
        } finally {
            setLoading(false);
        }
    };

    const getUserData = async (token) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${import.meta.env.VITE_APP_ENDPOINT}/users/`, { id: token }, {
                headers: { Authorization: `Bearer___${token}` },
            },);
            
            return response.data.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Error de inicio de sesión');
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUserData(null); // Limpia los datos del usuario
    };

    return { loading, error, login, logout };
};

export default UseLogin;
