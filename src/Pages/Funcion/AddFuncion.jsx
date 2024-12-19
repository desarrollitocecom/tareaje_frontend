import React, { useState } from 'react'
import CustomModal from '../../Components/Modal/CustomModal'
import AddIcon from '@mui/icons-material/Add';
import { Button, IconButton, Tooltip, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import { useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import CustomSwal, { swalError }  from '../../helpers/swalConfig';
import useFetch from '../../Components/hooks/useFetch';

const AddFuncion = ({refreshData}) => {
    const [Open, setOpen] = useState(false)
    const { postData } = useFetch();
    const { token } = useSelector(state => state.auth);

    const handleClose = () => {
        setOpen(false);
    }

    const validate = (values) => {
        const errors = {};
        if (!values.nombre) {
            errors.nombre = 'Campo requerido';
        } else if (!/^[A-Za-zÑñÁÉÍÓÚáéíóú\s]+$/.test(values.nombre)) { // Verifica si solo contiene letras y espacios
            errors.nombre = 'El nombre solo debe contener letras';
        }
        if (!values.tipo) {
            errors.tipo = 'Campo requerido';
        }
        return errors;
    }

    
    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const response = await postData(`${import.meta.env.VITE_APP_ENDPOINT}/funciones`, values, token);
    
            if (response.status) {
                setOpen(false);
                CustomSwal.fire(
                    'Agregado',
                    'La función ha sido agregado correctamente.',
                    'success'
                );
                refreshData();
                resetForm();
            } else {
                swalError(response.error.response.data);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            swalError({
                message:  'Error inesperado al agregar la función',
                data: [error.message],
            });
        } finally {
            
            setSubmitting(false);
        }
    };


    return (
        <>
            <Tooltip title="Añadir" placement='top' arrow>
                <IconButton aria-label="add" onClick={() => setOpen(true)}>
                    <AddIcon />
                </IconButton>
            </Tooltip>
            <CustomModal Open={Open} setOpen={setOpen} handleClose={handleClose}>
                <div className="flex items-center mb-2">
                    <SecurityIcon className="w-6 h-6 mr-2" />
                    <h1 className='text-lg font-bold fl'>Añadir una Funcion</h1>
                </div>
                <Formik
                    initialValues={{ nombre: '', tipo: '' }}
                    validate={validate}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched, values, handleChange, handleBlur }) => (
                        <Form>
                            <div className="mb-3 flex flex-col gap-4">
                                <Field
                                    as={TextField}
                                    label="Funcion"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    name="nombre"
                                    error={touched.nombre && Boolean(errors.nombre)}
                                    helperText={touched.nombre && errors.nombre || 'Ingrese la funcion'}
                                />
                                <FormControl fullWidth size='small' error={touched.tipo && errors.tipo}>
                                    <InputLabel id="select-helper-label">Tipo Area</InputLabel>
                                    <Select
                                        labelId="select-helper-label"
                                        id="select-helper"
                                        label="Tipo Función"
                                        name="tipo"
                                        value={values.tipo}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    >
                                        <MenuItem value={"Operativo"}>Operativo</MenuItem>
                                        <MenuItem value={"Intervención"}>Intervención</MenuItem>
                                        <MenuItem value={"Administrativo"}>Administrativo</MenuItem>
                                        <MenuItem value={"Libre"}>Libre</MenuItem>
                                    </Select>
                                    <FormHelperText>{touched.tipo && errors.tipo || 'Seleccione el tipo de funcion'}</FormHelperText>
                                </FormControl>
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
    )
}

export default AddFuncion