import axios from 'axios';
import CustomSwal, { swalError } from '../../helpers/swalConfig';


const deleteJurisdiccion = (obj, refreshData, token, deleteData) => {
    CustomSwal.fire({
        title: '¿Seguro que quieres eliminar?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            const eliminar = async () => {
                try {
                    
                    const response = await deleteData(`${import.meta.env.VITE_APP_ENDPOINT}/jurisdicciones/${obj.id}`, token);
                    console.log(response);
                    CustomSwal.fire(
                        'Eliminado',
                        'La jurisdicción ha sido eliminada correctamente.',
                        'success'
                    );
                    refreshData(); // Refresca los datos después de eliminar
                } catch (error) {
                    console.error('Error eliminando la jurisdicción:', error);
                    swalError({
                        message: 'Hubo un problema al eliminar la jurisdicción.',
                        data: [error.response?.data?.message || error.message],
                    });
                }
            };
            eliminar();
        }
    });
};

export default deleteJurisdiccion;
