import React, { useEffect, useState } from 'react';
import CustomModal from '../../Components/Modal/CustomModal';
import SecurityIcon from '@mui/icons-material/Security';
import { Button, TextField, Autocomplete } from '@mui/material';
import { useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import useFetch from '../../Components/hooks/useFetch';
import CustomSwal from '../../helpers/swalConfig';
import useFetchData from '../../Components/hooks/useFetchData';

const EditUsuario = ({ Selected, setSelected, refreshData }) => {
    const { patchData } = useFetch();
    const [Open, setOpen] = useState(false);
    const [roles, setRoles] = useState([]);
    const { token } = useSelector((state) => state.auth);
    const { fetchRoles } = useFetchData(token);

    useEffect(() => {
        setOpen(Selected !== null);
        if (token) {
            fetchRoles().then((rolesData) => setRoles(rolesData.data));
        }
    }, [Selected, token]);

    const handleClose = () => {
        setSelected(null);
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        console.log(values);
        try {
            const response = await patchData(
                `${import.meta.env.VITE_APP_ENDPOINT}/login/modifyuser/`,
                values,
                token
            );
            console.log(response);
            if (response.status) {
                CustomSwal.fire('Modificado', 'El usuario ha sido modificado correctamente.', 'success');
                resetForm();
                setSubmitting(false);
                handleClose();

                // Llamada a `refreshData` para recargar la lista de usuarios
                if (refreshData) {
                    refreshData();
                }
            } else {
                CustomSwal.fire({
                    icon: 'error',
                    title: response.error.response.data.message || 'Error al modificar el usuario',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 4000
                });
                setSubmitting(false);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            CustomSwal.fire({
                icon: 'error',
                title: 'Error al modificar el usuario',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 4000
            });
            setSubmitting(false);
        }
    };

    const validate = (values) => {
        const errors = {};
        if (!values.usuario) {
            errors.usuario = 'Campo requerido';
        }
        if (!values.correo) {
            errors.correo = 'Campo requerido';
        } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(values.correo)) {
            errors.correo = 'Correo no válido';
        }
        if (!values.rol) {
            errors.rol = 'Campo requerido';
        }
        return errors;
    };

    return (
        <CustomModal Open={Open} setOpen={setOpen} handleClose={handleClose}>
            <div className="flex items-center mb-2">
                <SecurityIcon className="w-6 h-6 mr-2" />
                <h1 className='text-lg font-bold'>Editar un usuario</h1>
            </div>
            <Formik
                initialValues={{
                    usuario: '',
                    correo: '',
                    rol: '',
                    id_rol: ''
                }}
                enableReinitialize
                validate={validate}
                onSubmit={handleSubmit}
            >
                {({ errors, touched, setFieldValue, values, isSubmitting }) => {
                    // Actualizar automáticamente los valores cuando se selecciona un usuario
                    useEffect(() => {
                        if (Selected) {
                            setFieldValue('usuario', Selected.usuario || '');
                            setFieldValue('correo', Selected.correo || '');
                            setFieldValue('rol', Selected.rol || '');
                            setFieldValue('id_rol', Selected.id_rol || '');
                        }
                    }, [Selected, setFieldValue]);

                    return (
                        <Form>
                            <div className="mb-3">
                                <Field
                                    as={TextField}
                                    label="Usuario"
                                    name="usuario"
                                    variant="outlined"
                                    fullWidth
                                    error={touched.usuario && Boolean(errors.usuario)}
                                    helperText={touched.usuario && errors.usuario}
                                />
                            </div>
                            <div className="mb-3">
                                <Field
                                    as={TextField}
                                    label="Correo"
                                    name="correo"
                                    variant="outlined"
                                    fullWidth
                                    error={touched.correo && Boolean(errors.correo)}
                                    helperText={touched.correo && errors.correo}
                                />
                            </div>
                            <div className="mb-3">
                                <Autocomplete
                                    options={roles}
                                    getOptionLabel={(option) => option.nombre}
                                    value={roles.find((role) => role.id === values.id_rol) || null}
                                    onChange={(event, value) => {
                                        setFieldValue('rol', value?.nombre || '');
                                        setFieldValue('id_rol', value?.id || '');
                                    }}
                                    renderOption={(props, option) => (
                                        <li {...props} key={option.id}>{option.nombre}</li>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Rol"
                                            variant="outlined"
                                            error={touched.rol && Boolean(errors.rol)}
                                            helperText={touched.rol && errors.rol}
                                            fullWidth
                                        />
                                    )}
                                />
                            </div>
                            <div className="flex justify-between pt-5">
                                <Button
                                    type="button"
                                    size="small"
                                    variant="contained"
                                    color="inherit"
                                    onClick={handleClose}
                                >
                                    Cerrar
                                </Button>
                                <Button
                                    type="submit"
                                    size="small"
                                    variant="contained"
                                    color="success"
                                    disabled={isSubmitting}
                                >
                                    Guardar
                                </Button>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </CustomModal>
    );
};

export default EditUsuario;
