import React, { useEffect, useState } from 'react';
import CustomModal from '../../Components/Modal/CustomModal';
import AddIcon from '@mui/icons-material/Add';
import { Button, IconButton, Tooltip, TextField, Autocomplete } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import { useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import CustomSwal from '../../helpers/swalConfig';
import useFetch from '../../Components/hooks/useFetch';
import useFetchData from '../../Components/hooks/useFetchData';

const AddUsuario = ({ refreshData }) => {
    const { postData } = useFetch();
    const [Open, setOpen] = useState(false);
    const [empleados, setEmpleados] = useState([]);
    const [roles, setRoles] = useState([]);
    const { token } = useSelector((state) => state.auth);
    const { fetchEmpleados, fetchRoles } = useFetchData(token);

    useEffect(() => {
        fetchEmpleados().then((empleados) => setEmpleados(empleados.data));
        fetchRoles().then((roles) => setRoles(roles.data));
    }, []);

    const handleClose = (resetForm) => {
        setOpen(false);
        resetForm();
    };

    const validate = (values) => {
        const errors = {};
        if (!values.usuario) {
            errors.usuario = 'Campo requerido';
        } else if (!/^[A-Za-zÑñÁÉÍÓÚáéíóú\s]+$/.test(values.usuario)) {
            errors.usuario = 'El usuario solo debe contener letras';
        }
        if (!values.correo) {
            errors.correo = 'Campo requerido';
        } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(values.correo)) {
            errors.correo = 'Correo no válido';
        }
        if (!values.contraseña) {
            errors.contraseña = 'Campo requerido';
        } else if (values.contraseña.length < 6) {
            errors.contraseña = 'La contraseña debe tener al menos 6 caracteres';
        }
        return errors;
    };

    const handleSubmit = async (values, { resetForm }) => {
        try {
            const response = await postData(`${import.meta.env.VITE_APP_ENDPOINT}/login/signup`, values, token);
            console.log(response);
            if (response.status) {
                CustomSwal.fire('Agregado', 'El usuario ha sido agregado correctamente.', 'success');
                refreshData();
                handleClose(resetForm);
            } else {
                CustomSwal.fire({
                    icon: 'error',
                    title: response.error.response.data.message,
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 4000
                });
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error en la solicitud';
            console.log(response.error)
            CustomSwal.fire({
                icon: 'error',
                title: errorMessage,
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 4000
            });
        }
    };

    return (
        <>
            <Tooltip title="Añadir" placement='top' arrow>
                <IconButton aria-label="add" onClick={() => setOpen(true)}>
                    <AddIcon />
                </IconButton>
            </Tooltip>
            <CustomModal Open={Open} setOpen={setOpen} handleClose={() => setOpen(false)}>
                <div className="flex items-center mb-2">
                    <SecurityIcon className="w-6 h-6 mr-2" />
                    <h1 className='text-lg font-bold'>Añadir un usuario</h1>
                </div>
                <Formik
                    initialValues={{ usuario: '', correo: '', contraseña: '', dni: '', id_empleado: '', id_rol: '' }}
                    validate={validate}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched, setFieldValue, resetForm }) => (
                        <Form>
                            <div className="mb-3">
                                <Field
                                    as={TextField}
                                    label="Usuario"
                                    variant="outlined"
                                    fullWidth
                                    name="usuario"
                                    error={touched.usuario && Boolean(errors.usuario)}
                                    helperText={touched.usuario && errors.usuario}
                                />
                            </div>
                            <div className="mb-3">
                                <Field
                                    as={TextField}
                                    label="Correo"
                                    variant="outlined"
                                    fullWidth
                                    name="correo"
                                    error={touched.correo && Boolean(errors.correo)}
                                    helperText={touched.correo && errors.correo}
                                />
                            </div>
                            <div className="mb-3">
                                <Field
                                    as={TextField}
                                    label="Contraseña"
                                    type="password"
                                    variant="outlined"
                                    fullWidth
                                    name="contraseña"
                                    error={touched.contraseña && Boolean(errors.contraseña)}
                                    helperText={touched.contraseña && errors.contraseña}
                                />
                            </div>
                            <div className="mb-3">
                                <Autocomplete
                                    options={empleados}
                                    getOptionLabel={(option) => `${option.dni} - ${option.nombres} ${option.apellidos}`}
                                    onChange={(event, value) => {
                                        setFieldValue('dni', value?.dni || '');
                                        setFieldValue('id_empleado', value?.id || '');
                                    }}
                                    renderOption={(props, option) => (
                                        <li {...props} key={option.id}>{`${option.dni} - ${option.nombres} ${option.apellidos}`}</li>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="DNI"
                                            variant="outlined"
                                            fullWidth
                                        />
                                    )}
                                />

                            </div>
                            <div className="mb-3">
                                <Autocomplete
                                    options={roles}
                                    getOptionLabel={(option) => option.nombre}
                                    onChange={(event, value) => {
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
                                            fullWidth
                                        />
                                    )}
                                />

                            </div>
                            <div className="flex justify-between pt-5">
                                <Button type="button" size="small" variant="contained" color="inherit" onClick={() => handleClose(resetForm)}>
                                    Cerrar
                                </Button>
                                <Button type="submit" size="small" variant="contained" color="success">
                                    Agregar
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </CustomModal>
        </>
    );
};

export default AddUsuario;
