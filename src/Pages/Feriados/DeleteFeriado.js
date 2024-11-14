import axios from 'axios';
import CustomSwal from '../../helpers/swalConfig';

const deleteFeriado = (obj, refreshData, token, deleteData) => {
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
                    const response = await deleteData(`${import.meta.env.VITE_APP_ENDPOINT}/feriados/${obj.id}`,token)
                    CustomSwal.fire(
                        'Eliminado',
                        'El regimen laboral ha sido eliminado correctamente.',
                        'success'
                      );
                      refreshData(); // Refresca los datos después de eliminar
                  } catch (error) {
                    CustomSwal.fire(
                        'Error',
                        'Hubo un problema al eliminar el regimen laboral.',
                        'error'
                      );
                      console.error('Error eliminando el regimen laboral:', error);
                  } 
            }
            eliminar()        
        }
    });
};

export default deleteFeriado;
