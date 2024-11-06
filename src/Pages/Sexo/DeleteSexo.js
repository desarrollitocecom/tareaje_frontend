import axios from 'axios';
import CustomSwal from '../../helpers/swalConfig';


const deleteSexo = (obj, refreshData, token, deleteData) => {

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
                //console.log(obj)

                try {
                    const response = await deleteData(`${import.meta.env.VITE_APP_ENDPOINT}/sexos/${obj.id}`,token)
                    console.log(response)
                    CustomSwal.fire(
                        'Eliminado',
                        'El sexo ha sido eliminado correctamente.',
                        'success'
                      );
                      refreshData(); // Refresca los datos después de eliminar
                  } catch (error) {
                    CustomSwal.fire(
                        'Error',
                        'Hubo un problema al eliminar el sexo.',
                        'error'
                      );
                      console.error('Error eliminando el sexo:', error);
                  } 
            }
            eliminar()        
            }
            
        }
    );
};

export default deleteSexo;
