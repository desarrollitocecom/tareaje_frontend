import React, { useEffect, useState } from 'react';
import CustomModal from '../../Components/Modal/CustomModal';
import SecurityIcon from '@mui/icons-material/Security';
import { Button, TextField, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import useFetch from '../../Components/hooks/useFetch';
import CustomSwal from '../../helpers/swalConfig';

const EditRegimen = ({ Selected, setSelected, refreshData }) => {
    const { patchData } = useFetch();
    const [Open, setOpen] = useState(false);
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        setOpen(Selected !== null);
    }, [Selected]);

    const handleClose = () => {
        setSelected(null);
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const response = await patchData(`${import.meta.env.VITE_APP_ENDPOINT}/regimenlaborales/${Selected?.id}`, values, token);
            if (response.status) {
                CustomSwal.fire(
                    'Modificado',
                    'El régimen laboral ha sido modificado correctamente.',
                    'success'
                );
                refreshData();
                resetForm();
                setSubmitting(false);
                handleClose();
            } else {
                const message = response?.error?.response?.data?.message || 'Ocurrió un error';
                const erroresArray = response?.error?.response?.data?.errores || [];
                const errores = erroresArray.length > 0
                    ? erroresArray.join(', ') // Unimos los elementos del array de errores
                    : 'No se encontraron detalles del error';

                // Mostramos la alerta
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

    const validate = (values) => {
        const errors = {};
        if (!values.nombre) {
            errors.nombre = 'Campo requerido';
        } else if (!/^[A-Za-zÑñÁÉÍÓÚáéíóú\s]+$/.test(values.nombre)) {
            errors.nombre = 'El nombre solo debe contener letras';
        }
        return errors;
    };

    return (
        <CustomModal Open={Open} setOpen={setOpen} handleClose={handleClose}>
            <div className="flex items-center mb-4">
                <SecurityIcon className="w-6 h-6 mr-2" />
                <h1 className="text-lg font-bold">Editar un Régimen</h1>
            </div>
            <Formik
                initialValues={{
                    nombre: Selected?.nombre || '',
                }}
                enableReinitialize
                validate={validate}
                onSubmit={handleSubmit}
            >
                {({ errors, touched, isSubmitting }) => (
                    <Form>
                        {/* Contenedor responsivo */}
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                                width: '100%',
                                maxWidth: { xs: '100%', sm: 400 },
                                mx: 'auto'
                            }}
                        >
                            {/* Campo de nombre */}
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

                            {/* Botones de acción */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    mt: 3
                                }}
                            >
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
                            </Box>
                        </Box>
                    </Form>
                )}
            </Formik>
        </CustomModal>
    );
};

export default EditRegimen;
