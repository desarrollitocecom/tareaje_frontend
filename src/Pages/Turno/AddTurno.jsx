import React, { useState } from 'react';
import CustomModal from '../../Components/Modal/CustomModal';
import AddIcon from '@mui/icons-material/Add';
import { Button, IconButton, Tooltip, TextField } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import { useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import useFetch from '../../Components/hooks/useFetch';
import CustomSwal from '../../helpers/swalConfig';


const AddTurno = ({ refreshData }) => {
    const { postData } = useFetch();
    const [Open, setOpen] = useState(false);
    const { token } = useSelector((state) => state.auth);

    const handleClose = () => {
        setOpen(false);
    };

    // Validación 
    const validate = (values) => {
        const errors = {};

        if (!values.nombre) {
            errors.nombre = 'Campo requerido';
        } else if (!/^[A-Za-zÑñÁÉÍÓÚáéíóú\s]+$/.test(values.nombre)) { // Verifica si solo contiene letras y espacios
            errors.nombre = 'El nombre solo debe contener letras';
        }

        return errors;
    };

    const handleSubmit = async (values, { resetForm }) => {
        try {
            const response = await postData(`${import.meta.env.VITE_APP_ENDPOINT}/turnos`, values, token);

            if (response.status) {
                setOpen(false);
                CustomSwal.fire(
                    'Agregado',
                    'El turno ha sido agregado correctamente.',
                    'success'
                );
                // Llama a la función para refrescar los datos después de agregar el turno
                refreshData();
                resetForm();
            } else {
                console.error('Error al agregar el turno:', response.error.response.data.error);
                CustomSwal.fire({
                    icon: 'error',
                    title: response.error.response.data.error,
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 4000
                });
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            CustomSwal.fire({
                icon: 'error',
                title: response.error.response.data.error,
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
                    <h1 className="text-lg font-bold">Añadir un Turno</h1>
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
                                    name="nombre"
                                    error={touched.nombre && Boolean(errors.nombre)}
                                    helperText={touched.nombre && errors.nombre}
                                />
                            </div>
                            <div className="flex justify-between pt-5">
                                <div></div>
                                <div className="flex gap-3">
                                    <Button type="button" size="small" variant="contained" color="inherit" onClick={handleClose}>
                                        Cerrar
                                    </Button>
                                    <Button type="submit" size="small" variant="contained" color="success" onClick={handleClose}>
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

export default AddTurno;
