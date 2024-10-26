import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const CustomSwal = withReactContent(Swal.mixin({
    confirmButtonText: 'Aceptar',
    cancelButtonText: 'Cancelar',
    icon: 'info',
  }));
  
  export default CustomSwal;