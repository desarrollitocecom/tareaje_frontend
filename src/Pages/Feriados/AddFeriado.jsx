import React, { useState } from 'react';
import CustomModal from '../../Components/Modal/CustomModal';
import AddIcon from '@mui/icons-material/Add';
import { Button, IconButton, Tooltip, TextField } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import { useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import useFetch from '../../Components/hooks/useFetch';
import CustomSwal from '../../helpers/swalConfig';
import dayjs from 'dayjs';

const AddFeriado = ({ refreshData }) => {
    const { postData } = useFetch();
    const [Open, setOpen] = useState(false);
    const { token } = useSelector((state) => state.auth);

    const handleClose = () => {
        setOpen(false);
    };

    const validate = (values) => {
        const errors = {};

        if (!values.nombre) {
            errors.nombre = 'Campo requerido';
        } else if (!/^[A-Za-zÑñÁÉÍÓÚáéíóú\s]+$/.test(values.nombre)) {
            errors.nombre = 'El nombre solo debe contener letras';
        }

        if (!values.fecha) {
            errors.fecha = 'Campo requerido';
        }

        return errors;
    };

    const handleSubmit = async (values, { resetForm }) => {
        try {
            const response = await postData(`${import.meta.env.VITE_APP_ENDPOINT}/feriados`, values, token);

            if (response.status) {
                setOpen(false);
                CustomSwal.fire(
                    'Agregado',
                    'El feriado ha sido agregado correctamente.',
                    'success'
                );
                refreshData();
                resetForm();
            } else {
                const message = response?.error?.response?.data?.message || 'Ocurrió un error';
                const erroresArray = response?.error?.response?.data?.errores || [];
                const errores = erroresArray.length > 0
                    ? erroresArray.join(', ')
                    : 'No se encontraron detalles del error';

                CustomSwal.fire({
                    icon: 'error',
                    title: `${message}: ${errores}`,
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 4000,
                });

            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            CustomSwal.fire({
                icon: 'error',
                title: 'Error en la solicitud',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 4000
            });
        }
    };

    return (
        <>
            <Tooltip title="Añadir" placement="top" arrow>
                <IconButton aria-label="add" onClick={() => setOpen(true)}>
                    <AddIcon />
                </IconButton>
            </Tooltip>
            <CustomModal Open={Open} setOpen={setOpen} handleClose={handleClose}>
                <div className="flex items-center mb-2">
                    <SecurityIcon className="w-6 h-6 mr-2" />
                    <h1 className="text-lg font-bold">Añadir un Feriado</h1>
                </div>
                <Formik
                    initialValues={{ nombre: '', fecha: null }}
                    validate={validate}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched, setFieldValue }) => (
                        <Form>
                            <div className="mb-3">
                                <Field
                                    as={TextField}
                                    label="Nombre"
                                    variant="outlined"
                                    fullWidth
                                    name="nombre"
                                    error={touched.nombre && Boolean(errors.nombre)}
                                    helperText={touched.nombre && errors.nombre}
                                />
                            </div>
                            <div className="mb-3">
                                <DatePicker
                                    label="Fecha"
                                    value={null}
                                    name="fecha"
                                    onChange={(value) => setFieldValue('fecha', value)}
                                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            fullWidth
                                            error={touched.fecha && Boolean(errors.fecha)}
                                            helperText={touched.fecha && errors.fecha}
                                        />
                                    )}
                                />
                            </div>
                            <div className="flex justify-between pt-5">
                                <div></div>
                                <div className="flex gap-3">
                                    <Button type="button" size="small" variant="contained" color="inherit" onClick={handleClose}>
                                        Cerrar
                                    </Button>
                                    <Button type="submit" size="small" variant="contained" color="success">
                                        Agregar
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </CustomModal>
        </>
    );
};

export default AddFeriado;
