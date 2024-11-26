import CustomSwal, { swalError } from '../../helpers/swalConfig';


const deleteLugarTrabajo = (obj, refreshData, token, deleteData) => {
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
                    
                    const response = await deleteData(`${import.meta.env.VITE_APP_ENDPOINT}/lugarestrabajos/${obj.id}`, token);
                    console.log(response);
                    CustomSwal.fire(
                        'Eliminado',
                        'El lugar de trabajo ha sido eliminada correctamente.',
                        'success'
                    );
                    refreshData(); // Refresca los datos después de eliminar
                } catch (error) {
                    console.error('Error eliminando el lugar de trabajo:', error);
                    swalError({
                        message: 'Hubo un problema al eliminar el lugar de trabajo.',
                        data: [error.response?.data?.message || error.message],
                    });
                }
            };
            eliminar();
        }
    });
};

export default deleteLugarTrabajo;
