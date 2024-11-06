// src/pages/EditCargo.js
import React, { useEffect, useState } from 'react';
import CustomModal from '../../Components/Modal/CustomModal';
import SecurityIcon from '@mui/icons-material/Security';
import { Button, TextField, MenuItem } from '@mui/material';
import { useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import CustomSwal from '../../helpers/swalConfig';
import useFetch from '../../Components/hooks/useFetch';
import useSubgerencia from '../../Components/hooks/useSubgerencia';

const EditCargo = ({ Selected, setSelected, refreshData }) => {
    const { patchData } = useFetch();
    const [Open, setOpen] = useState(false);
    const { subgerencias } = useSubgerencia();
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {        
        setOpen(Selected !== null);
    }, [Selected]);

    const handleClose = () => {
        setSelected(null);
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        console.log(values,Selected?.id);
        
        try{

            const response = await patchData(`${import.meta.env.VITE_APP_ENDPOINT}/cargos/${Selected?.id}`, values, token);
            
            if (response.status) {
                setOpen(false);
                CustomSwal.fire(
                    'Modificado',
                    'El turno ha sido modificado correctamente.',
                    'success'
                );
                // Llama a la función para refrescar los datos después de agregar el turno
                refreshData();
                resetForm();
            setSubmitting(false);
            }else {
                console.error('Error al modificar el turno:', response.error.response.data.error);
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
            });        }
    };

    const validate = (values) => {
        const errors = {};
        if (!values.nombre) {
            errors.nombre = 'Campo requerido';
        }else if (!/^[A-Za-zÑñÁÉÍÓÚáéíóú\s]+$/.test(values.nombre)) { // Verifica si solo contiene letras y espacios
            errors.nombre = 'El nombre solo debe contener letras';
        }
        if (!values.sueldo) {
            errors.sueldo = 'Campo requerido';
        }
        if (!values.id_subgerencia) {
            errors.id_subgerencia = 'Campo requerido';
        }
        return errors;
    };

    return (
        <CustomModal Open={Open} setOpen={setOpen} handleClose={handleClose}>
            <div className="flex items-center mb-2">
                <SecurityIcon className="w-6 h-6 mr-2" />
                <h1 className="text-lg font-bold fl">Editar un cargo</h1>
            </div>
            {Selected && (
                <Formik
                    initialValues={{
                        nombre: Selected.nombres || '',
                        sueldo: Selected.sueldo || '',
                        id_subgerencia: Selected.subgerencia || '',
                    }}
                    enableReinitialize
                    validate={validate}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched, isSubmitting }) => (
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
                                <Field
                                    as={TextField}
                                    label="Sueldo"
                                    variant="outlined"
                                    type="number"
                                    fullWidth
                                    size="small"
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
                                    size="small"
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

export default EditCargo;
