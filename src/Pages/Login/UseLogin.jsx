import axios from 'axios';

const UseLogin = () => {
    const login = async (credentials) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_APP_ENDPOINT}/login/signin`, credentials);
            const token = response.data.token;
            
            if (!token) {
                throw ('Falta el token de autenticación.');
            }

            const dataUser = await getUserData(token);

            return {
                data: { user: dataUser, token: token },
                status: true
            };
        } catch (err) {            
            const errorMessage = err.response?.data?.message || 'Error de inicio de sesión';
            console.error(`Error en login: ${errorMessage}`); // Registro de error

            return {
                error: errorMessage,
                status: false
            };
        }
    };

    const getUserData = async (token) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_APP_ENDPOINT}/users/`, { id: token }, {
                headers: { Authorization: `Bearer___${token}` },
            });
            
            return response.data.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Error al obtener los datos del usuario';
            throw (errorMessage);
        }
    };

    return { login, getUserData };
};

export default UseLogin;
