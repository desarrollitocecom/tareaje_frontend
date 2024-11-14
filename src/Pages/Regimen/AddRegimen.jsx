import React, { useState } from 'react';
import CustomModal from '../../Components/Modal/CustomModal';
import AddIcon from '@mui/icons-material/Add';
import { Button, IconButton, Tooltip, TextField } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import { useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import useFetch from '../../Components/hooks/useFetch';
import CustomSwal from '../../helpers/swalConfig';

const AddRegimen = ({ refreshData }) => {
    const { postData } = useFetch();
    const [Open, setOpen] = useState(false);
    const { token } = useSelector((state) => state.auth);

    const handleClose = () => setOpen(false);

    const handleSubmit = async (values, { resetForm }) => {
        try {
            const response = await postData(`${import.meta.env.VITE_APP_ENDPOINT}/regimenlaborales`, values, token);
            if (response.status) {
                CustomSwal.fire('Agregado', 'El regimen laboral ha sido agregado correctamente.', 'success');
                setOpen(false);
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
            CustomSwal.fire({
                icon: 'error',
                title: 'Error en la solicitud',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 4000,
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
        <>
            <Tooltip title="Añadir" placement="top" arrow>
                <IconButton aria-label="add" onClick={() => setOpen(true)} size="small">
                    <AddIcon fontSize="small" />
                </IconButton>
            </Tooltip>
            <CustomModal Open={Open} setOpen={setOpen} handleClose={handleClose} disableEnforceFocus={true}
            >
                <div className="flex items-center mb-2">
                    <SecurityIcon className="w-6 h-6 mr-2" />
                    <h1 className="text-lg font-bold">Añadir un Regimen</h1>
                </div>
                <Formik
                    initialValues={{ nombre: '' }}
                    validate={validate}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched }) => (
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
                                >
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

export default AddRegimen;
