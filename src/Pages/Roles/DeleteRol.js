// deleteRole.js
import axios from 'axios';
import CustomSwal from '../../helpers/swalConfig';

const deleteRole = (obj, deleteData, token, refreshData) => {
    // const dispatch = useDispatch();

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

            deleteData(`${import.meta.env.VITE_APP_ENDPOINT}/auth/rol/${obj.id}`, token).then((res) => {
                if (res.status) {
                    CustomSwal.fire({
                        icon: 'success',
                        title: res.data.message,
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 4000
                    });
                    refreshData();
                } else {
                    CustomSwal.fire({
                        icon: 'error',
                        title: res.error.response.data.message,
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 4000
                    });
                }
            }).catch((err) => {
                console.error(err);
            })

        }
    });
};

export default deleteRole;
