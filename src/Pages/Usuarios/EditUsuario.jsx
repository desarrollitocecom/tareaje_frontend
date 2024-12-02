import React, { useEffect, useState } from 'react';
import CustomModal from '../../Components/Modal/CustomModal';
import SecurityIcon from '@mui/icons-material/Security';
import { Button, TextField, Autocomplete } from '@mui/material';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import useFetch from '../../Components/hooks/useFetch';
import useFetchData from '../../Components/hooks/useFetchData';
import CustomSwal, { swalError } from '../../helpers/swalConfig';

const EditUsuario = ({ Selected, setSelected, refreshData }) => {
    const { patchData } = useFetch();
    const [Open, setOpen] = useState(false);
    const [roles, setRoles] = useState([]);
    const { token } = useSelector((state) => state.auth);
    const { fetchRoles } = useFetchData(token);
    const [rolInputValue, setRolInputValue] = useState('');
    const [selectedRol, setSelectedRol] = useState(null);

    // Cargar roles al montar el componente
    useEffect(() => {
        const loadRoles = async () => {
            const result = await fetchRoles();
            if (!result.error) {
                const uniqueRoles = Array.from(new Map(result.data.map(role => [role.id, role])).values());
                setRoles(uniqueRoles);
            } else {
                console.error("Error al cargar roles:", result.error);
            }
        };
        
        loadRoles();
    }, []);

    // Manejo de datos al abrir el formulario de edición
    useEffect(() => {
        if (Selected && roles.length > 0) {
            setOpen(true);

            const rolSeleccionado = roles.find(role => role.nombre  === Selected.rol);
            setSelectedRol(rolSeleccionado || null);
            formik.setFieldValue('usuario', Selected.usuario || '');
            formik.setFieldValue('correo', Selected.correo || '');
            formik.setFieldValue('rol', rolSeleccionado?.nombre || '');
            formik.setFieldValue('id_rol', rolSeleccionado?.id || '');
        }
    }, [Selected]);


    const handleClose = () => {
        setSelected(null);
        setOpen(false);
        formik.resetForm();
    };

    const formik = useFormik({
        initialValues: {
            usuario: '',
            correo: '',
            rol: '',
            id_rol: '',
        },
        validate: (values) => {
            const errors = {};
            if (!values.usuario) {
                errors.usuario = 'Debe ingresar un usuario';
            }
            if (!values.correo) {
                errors.correo = 'Debe ingresar un correo';
            } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(values.correo)) {
                errors.correo = 'Correo no válido';
            }
            if (!values.rol) {
                errors.rol = 'Debe seleccionar un rol';
            }
            return errors;
        },
        onSubmit: async (values) => {
            try {
                const data = {
                    usuario: values.usuario,
                    correo: values.correo,
                    id_rol: values.id_rol,
                };

                const res = await patchData(
                    `${import.meta.env.VITE_APP_ENDPOINT}/login/modifyuser/`,
                    data,
                    token,
                    true
                );

                if (res.status) {
                    CustomSwal.fire({
                        icon: 'success',
                        title: res.data.message,
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 4000,
                    });
                    handleClose();
                    if (refreshData) refreshData();
                }else{
                    swalError(res.error.response.data);
                }
            } catch (error) {
                console.error('Error al modificar usuario:', error);
                CustomSwal.fire({
                    icon: 'error',
                    title: 'Error en la solicitud',
                    text: error.response?.data?.message || 'Hubo un problema al procesar tu solicitud.',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 4000,
                });
            }
        },
    });

    return (
        <CustomModal Open={Open} setOpen={setOpen} handleClose={handleClose}>
            <div className="flex items-center mb-2">
                <SecurityIcon className="w-6 h-6 mr-2" />
                <h1 className="text-lg font-bold">Editar Usuario</h1>
            </div>

            <form onSubmit={formik.handleSubmit} className="mt-8">
                <div className="flex flex-col gap-3">
                    <TextField
                        id="usuario"
                        label="Usuario"
                        variant="outlined"
                        size="small"
                        name="usuario"
                        value={formik.values.usuario}
                        onChange={formik.handleChange}
                        error={formik.touched.usuario && Boolean(formik.errors.usuario)}
                        helperText={formik.touched.usuario && formik.errors.usuario}
                        fullWidth
                    />
                    <TextField
                        id="correo"
                        label="Correo"
                        variant="outlined"
                        size="small"
                        name="correo"
                        value={formik.values.correo}
                        onChange={formik.handleChange}
                        error={formik.touched.correo && Boolean(formik.errors.correo)}
                        helperText={formik.touched.correo && formik.errors.correo}
                        fullWidth
                    />
                    <Autocomplete
                        options={roles}
                        getOptionLabel={(option) => `${option.nombre}`}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        value={selectedRol}
                        inputValue={rolInputValue}
                        onInputChange={(event, newInputValue) => {
                            setRolInputValue(newInputValue);
                        }}
                        onChange={(event, value) => {
                            setSelectedRol(value || null);
                            if (value) {
                                setRolInputValue(`${value.nombre}`);
                                formik.setFieldValue('rol', value.nombre);
                                formik.setFieldValue('id_rol', value.id);
                            } else {
                                setRolInputValue('');
                                formik.setFieldValue('rol', '');
                                formik.setFieldValue('id_rol', '');
                            }
                            formik.setTouched({ ...formik.touched, rol: true });
                        }}
                        renderOption={(props, option) => (
                            <li {...props} key={option.id}>
                                {option.nombre}
                            </li>
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Rol"
                                variant="outlined"
                                fullWidth
                                size="small"
                                error={formik.touched.rol && Boolean(formik.errors.rol)}
                                helperText={formik.touched.rol && formik.errors.rol}
                            />
                        )}
                    />


                    <div className="flex justify-between pt-5">
                        <Button type="button" size="small" variant="contained" color="inherit" onClick={handleClose}>
                            Cerrar
                        </Button>
                        <Button type="submit" size="small" variant="contained" color="success" disabled={formik.isSubmitting}>
                            Guardar
                        </Button>
                    </div>
                </div>
            </form>
        </CustomModal>
    );
};

export default EditUsuario;
