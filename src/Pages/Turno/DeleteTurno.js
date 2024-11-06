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
            const eliminar = async() => {

                try {
                    const response = await deleteData(`${import.meta.env.VITE_APP_ENDPOINT}/turnos/${obj.id}`)
                    if (response.status) {
                        setOpen(false);
                        CustomSwal.fire(
                            'Eliminado',
                            'El turno ha sido eliminado correctamente.',
                            'success'
                        );
                        // Llama a la función para refrescar los datos después de agregar el turno
                        refreshData();
                    } else {
                        console.error('Error al agregar el turno:', response.error.response.data.message);
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
                    CustomSwal.fire(
                        'Error',
                        'Hubo un problema al eliminar el turno.',
                        'error'
                      );
                      console.error('Error eliminando el turno:', error);
                  } 
            }
            eliminar()        
            }
            
        }
    );
};

export default deleteTurno;
