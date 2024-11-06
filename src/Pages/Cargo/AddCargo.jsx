import React, { useState } from 'react';
import CustomModal from '../../Components/Modal/CustomModal';
import AddIcon from '@mui/icons-material/Add';
import { Button, IconButton, Tooltip, TextField, MenuItem } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import { useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import CustomSwal from '../../helpers/swalConfig';
import useFetch from '../../Components/hooks/useFetch';
import useSubgerencia from '../../Components/hooks/useSubgerencia';


const AddCargo = ({refreshData}) => {
    const { postData } = useFetch();
    const [Open, setOpen] = useState(false);
    const { token } = useSelector((state) => state.auth);
    const { subgerencias } = useSubgerencia();  

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
        if (!values.sueldo) {
            errors.sueldo = 'Campo requerido';
        }
        if (!values.id_subgerencia) {
            errors.id_subgerencia = 'Campo requerido';
        }

        return errors;
    }

    const handleSubmit = async (values, { resetForm }) => {
        try {
            const response = await postData(`${import.meta.env.VITE_APP_ENDPOINT}/cargos`, values, token);
    
            if (response.status) {

                setOpen(false);
                CustomSwal.fire(
                    'Agregado',
                    'El cargo ha sido agregado correctamente.',
                    'success'
                );
                // Llama a la función para refrescar los datos después de agregar 
                refreshData();
                resetForm();
            } else {
                console.error('Error al agregar el cargo:', response.error.response.data.error);
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
                    <h1 className="text-lg font-bold fl">Añadir un Cargo</h1>
                </div>
                <Formik
                    initialValues={{ nombre: '', sueldo: '', id_subgerencia: '' }}
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
                            <div className="mb-3">
                                <Field
                                    as={TextField}
                                    label="Sueldo"
                                    variant="outlined"
                                    type="number"
                                    fullWidth
                                    name="sueldo"
                                    error={touched.sueldo && Boolean(errors.sueldo)}
                                    helperText={touched.sueldo && errors.sueldo}
                                />
                            </div>
                            <div className="mb-3">
                                <Field
                                    as={TextField}
                                    select
                                    label="Subgerencia"
                                    variant="outlined"
                                    fullWidth
                                    name="id_subgerencia"
                                    error={touched.id_subgerencia && Boolean(errors.id_subgerencia)}
                                    helperText={touched.id_subgerencia && errors.id_subgerencia}
                                >
                                    {subgerencias.map((subgerencia) => (
                                        <MenuItem key={subgerencia.id} value={subgerencia.id}>
                                            {subgerencia.nombre}
                                        </MenuItem>
                                    ))}
                                </Field>
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

export default AddCargo;
