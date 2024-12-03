import CustomSwal, { swalError } from '../../helpers/swalConfig';


const deleteCargo = (obj, refreshData, token, deleteData) => {

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
            //console.log(token)
            //console.log(obj.id)
            const eliminar = async() => {
                try {
                    
                    const response = await deleteData(`${import.meta.env.VITE_APP_ENDPOINT}/empleados/${obj.id}`,token)
                    CustomSwal.fire(
                        'Eliminado',
                        'El empleado ha sido eliminado correctamente.',
                        'success'
                      );
                      refreshData(); // Refresca los datos después de eliminar
                    } catch (error) {
                        console.error('Error eliminando el empleado:', error);
                        swalError({
                            message: 'Hubo un problema al eliminar el empleado.',
                            data: [error.response?.data?.message || error.message],
                        });
                    }
            }
            eliminar()        
            }
            
        }
    );
};

export default deleteCargo;