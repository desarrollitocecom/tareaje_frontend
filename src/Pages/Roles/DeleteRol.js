// deleteRole.js
import axios from 'axios';
import CustomSwal from '../../helpers/swalConfig';

const deleteRole = (obj, refreshData) => {
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
            //   axios.delete(`https://yourapiendpoint.com/delete/${obj.id}`)
            //     .then(() => {
            //       Swal.fire(
            //         'Eliminado',
            //         'El rol ha sido eliminado correctamente.',
            //         'success'
            //       );
            //       refreshData(); // Refresca los datos después de eliminar
            //     })
            //     .catch((error) => {
            //       Swal.fire(
            //         'Error',
            //         'Hubo un problema al eliminar el rol.',
            //         'error'
            //       );
            //       console.error('Error eliminando el rol:', error);
            //     });
            CustomSwal.fire(
                'Eliminado',
                'El rol ha sido eliminado correctamente.',
                'success'
            );
            refreshData(); // Refresca los datos después de eliminar
        }
    });
};

export default deleteRole;
