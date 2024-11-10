
import CryptoJS from 'crypto-js';

// Función para guardar el estado en localStorage
export const saveStateToLocalStorage = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        const encryptedState = CryptoJS.AES.encrypt(serializedState, import.meta.env.VITE_APP_SECRET_KEY).toString();
        localStorage.setItem('TareajeState', encryptedState);
    } catch (err) {
        console.error("No se pudo guardar el estado en localStorage", err);
    }
};

// Función para recuperar el estado desde localStorage
export const loadStateFromLocalStorage = () => {
    try {
        const encryptedState = localStorage.getItem('TareajeState');
        if (encryptedState === null) return undefined;

        const bytes = CryptoJS.AES.decrypt(encryptedState, import.meta.env.VITE_APP_SECRET_KEY);
        const decryptedState = bytes.toString(CryptoJS.enc.Utf8);

        return JSON.parse(decryptedState);
    } catch (err) {
        console.error("No se pudo recuperar el estado desde localStorage", err);
        return undefined;
    }
};