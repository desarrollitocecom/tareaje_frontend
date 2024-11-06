import axios from 'axios';
import CustomSwal from '../../helpers/swalConfig';


const deleteTurno = ({obj, refreshData, token, deleteData}) => {

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
                    const response = await deleteData(`${import.meta.env.VITE_APP_ENDPOINT}/turnos/${obj.id}`,token)
                    console.log(response)
                    CustomSwal.fire(
                        'Eliminado',
                        'El turno ha sido eliminado correctamente.',
                        'success'
                      );
                      refreshData(); // Refresca los datos después de eliminar
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
