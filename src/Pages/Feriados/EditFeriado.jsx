import React, { useEffect, useState } from 'react';
import CustomModal from '../../Components/Modal/CustomModal';
import SecurityIcon from '@mui/icons-material/Security';
import { Button, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import useFetch from '../../Components/hooks/useFetch';
import CustomSwal from '../../helpers/swalConfig';
import dayjs from 'dayjs';

const EditFeriado = ({ Selected, setSelected, refreshData }) => {
    const { patchData } = useFetch();
    const [Open, setOpen] = useState(false);
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        setOpen(Selected !== null);
    }, [Selected]);

    const handleClose = () => {
        setSelected(null);
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

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const response = await patchData(`${import.meta.env.VITE_APP_ENDPOINT}/feriados/${Selected?.id}`, values, token);
            if (response.status) {
                setOpen(false);
                CustomSwal.fire(
                    'Modificado',
                    'El feriado ha sido modificado correctamente.',
                    'success'
                );
                refreshData();
                resetForm();
                setSubmitting(false);
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
        <CustomModal Open={Open} setOpen={setOpen} handleClose={handleClose}>
            <div className="flex items-center mb-2">
                <SecurityIcon className="w-6 h-6 mr-2" />
                <h1 className='text-lg font-bold'>Editar un feriado</h1>
            </div>
            {Selected && (
                <Formik
                    initialValues={{
                        nombre: Selected?.nombre || '',
                        fecha: Selected?.fecha ? dayjs(Selected.fecha) : null,
                    }}
                    enableReinitialize
                    validate={validate}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched, isSubmitting, setFieldValue }) => (
                        <Form>
                            <div className="mb-3">
                                <Field
                                    as={TextField}
                                    label="Nombre"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    name="nombre"
                                    error={touched.nombre && Boolean(errors.nombre)}
                                    helperText={touched.nombre && errors.nombre}
                                />
                            </div>
                            <div className="mb-3">
                                <DatePicker
                                    label="Fecha"
                                    value={Selected?.fecha ? dayjs(Selected.fecha) : null}
                                    onChange={(value) => setFieldValue('fecha', value)}
                                    fullWidth
                                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            error={touched.fecha && Boolean(errors.fecha)}
                                            helperText={touched.fecha && errors.fecha}
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
                                    Actualizar
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            )}
        </CustomModal>
    );
};

export default EditFeriado;
