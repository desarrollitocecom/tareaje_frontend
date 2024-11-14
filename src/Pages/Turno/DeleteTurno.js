import axios from 'axios';
import CustomSwal from '../../helpers/swalConfig';


const deleteTurno = (obj, refreshData, token, deleteData) => {

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
                    const response = await deleteData(`${import.meta.env.VITE_APP_ENDPOINT}/turnos/${obj.id}`, token)
                    if (response.status) {
                        CustomSwal.fire({
                            icon: 'success',
                            title: response.data.message,
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 4000
                        });
                        refreshData();
                    } else {
                        CustomSwal.fire({
                            icon: 'error',
                            title: response.error.response.data.message,
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 4000
                        });
                    }
                } catch (error) {
                    console.error('Error en la solicitud:', error);
                    CustomSwal.fire({
                        icon: 'error',
                        title: 'Error en la solicitud',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 4000
                    });
                }
            }
            eliminar()
        }
    });
};

export default deleteTurno;
