
import CustomSwal, { swalError } from '../../helpers/swalConfig';

const deleteHorario = (obj, refreshData, token, deleteData) => {
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
      deleteData(`${import.meta.env.VITE_APP_ENDPOINT}/rangohorarios/${obj.id}`, token).then((response) => {
        if (response.status) {
          CustomSwal.fire(
            'Eliminado',
            'El hotario ha sido eliminado correctamente.',
            'success'
          );
          refreshData();
        }
        else{
        throw new Error("Error al eliminar el hotario");
        
        }
      }).catch((error) => {
        console.error('Error eliminando el hotario:', error);
        swalError({
          message: 'Hubo un problema al eliminar el hotario.',
          data: [error.response?.data?.message || error.message],
        });
      });
    }
  });
};

export default deleteHorario;
