import axios from 'axios';
import CustomSwal from '../../helpers/swalConfig';

const deleteUsuario = (obj, refreshData, token, deleteData) => {
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
                    const response = await deleteData(`${import.meta.env.VITE_APP_ENDPOINT}/users/${obj.usuario}`,token)
                    if (response.status) {
                        setOpen(true);
                        CustomSwal.fire(
                            'Eliminado',
                            'El usuario ha sido eliminado correctamente.',
                            'success'
                          );
                          refreshData();
                    } else {
                        // Mostrar un mensaje de error específico si hay uno en la respuesta
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
                        'Hubo un problema al eliminar el usuario.',
                        'error'
                      );
                      console.error('Error eliminando el usuario:', error);
                  } 
            }
            eliminar()     
        }
    });
};

export default deleteUsuario;
