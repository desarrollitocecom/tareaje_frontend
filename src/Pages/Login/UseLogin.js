import axios from 'axios';
import { socket } from '../../Components/Socket/socket';
import useFetch from '../../Components/hooks/useFetch';
import { stringify } from 'uuid';

const UseLogin = () => {
    const { getData, postData } = useFetch()

    const login = async (credentials) => {
        try {
            const response = await postData(`${import.meta.env.VITE_APP_ENDPOINT}/login/signin`, credentials);

            const token = response.data.token;

            if (!token) {
                throw ('Falta el token de autenticación.');
            }

            const dataUser = await getUserData(token);

            socket.emit('register', dataUser.usuario)

            return {
                data: { user: dataUser, token: token },
                status: true
            };
        } catch (err) {
            const errorMessage = err.response?.data?.message || err || 'Error de inicio de sesión';

            return {
                error: errorMessage,
                status: false
            };
        }
    };

    const getUserData = async (token) => {
        try {
            const response = await getData(`${import.meta.env.VITE_APP_ENDPOINT}/users/myuser`, token);

            const data = response.data.data;

            const permissions = await getPermissions(data.id_rol, token);

            return { ...data, permissions };
        } catch (err) {
            const errorMessage = err.response?.data?.message || err || 'Error al obtener los datos del usuario';
            throw (errorMessage);
        }
    };

    const getPermissions = async (idRol, token) => {
        try {
            const response = await getData(`${import.meta.env.VITE_APP_ENDPOINT}/auth/rol/permisos/${idRol}`, token);

            return response.data.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Error al obtener permisos del rol';
            throw (errorMessage);
        }
    };

    return { login, getUserData };
};

export default UseLogin;
