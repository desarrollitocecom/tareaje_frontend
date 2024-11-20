import axios from 'axios';
import { socket } from '../../Components/Socket/socket';
import useFetch from '../../Components/hooks/useFetch';
import { stringify } from 'uuid';

const UseLogin = () => {
    const { getData, postData } = useFetch()

    const login = async (credentials) => {
        try {
            const response = await postData(`${import.meta.env.VITE_APP_ENDPOINT}/login/signin`, credentials);

            if (response.status) {
                const token = response?.data?.token;
                
                if (!token) {
                    throw ('Falta el token de autenticación.');
                }
                
                const dataUser = await getUserData(token);
                
                socket.emit('register', dataUser.usuario)
                
                return {
                    data: { user: dataUser, token: token },
                    status: true
                };
            } else {
                throw (response?.error?.response?.data || response?.error?.message);

            }


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

            if (response.status) {
                const data = response.data.data;

                const permissions = await getPermissions(data.id_rol, token);

                return { ...data, permissions };
            }
            else{
                throw (response.error.response.data.message);
            }


        } catch (err) {
            const errorMessage = err.response?.data?.message || err || 'Error al obtener los datos del usuario';
            throw (errorMessage);
        }
    };

    const getPermissions = async (idRol, token) => {
        try {
            const response = await getData(`${import.meta.env.VITE_APP_ENDPOINT}/auth/rol/permisos/${idRol}`, token);
            if (response) {
                return response.data.data;
            }else{
                throw (response.error.response.data.message);
            }

            
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Error al obtener permisos del rol';
            throw (errorMessage);
        }
    };

    return { login, getUserData };
};

export default UseLogin;
