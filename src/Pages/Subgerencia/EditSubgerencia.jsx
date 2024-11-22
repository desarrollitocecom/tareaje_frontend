import React, { useEffect, useState } from 'react'
import CustomModal from '../../Components/Modal/CustomModal'
import SecurityIcon from '@mui/icons-material/Security';
import { Button,TextField } from '@mui/material';
import { useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import CustomSwal, { swalError } from '../../helpers/swalConfig';
import useFetch from '../../Components/hooks/useFetch';

const EditSubgerencia = ({ Selected, setSelected, refreshData }) => {

    const { patchData } = useFetch();
    const [Open, setOpen] = useState(false);
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {        
        setOpen(Selected !== null);
    }, [Selected])
    


    const handleClose = () => {
        setSelected(null);
    }

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const response = await patchData(`${import.meta.env.VITE_APP_ENDPOINT}/subgerencias/${Selected?.id}`, values, token);
    
            if (response.status) {
                setOpen(false);
                CustomSwal.fire(
                    'Modificado',
                    'La subgerencia ha sido modificado correctamente.',
                    'success'
                );
                refreshData();
                resetForm();
            } else {
                const erroresArray = response?.error?.response?.data?.errores || [];
                swalError({
                    message: 'Ocurrió un error al modificar la subgerencia',
                    data: erroresArray,
                });
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            swalError({
                message: 'Error inesperado al modificar la subgerencia',
                data: [error.message],
            });
        } finally {
            
            setSubmitting(false);
        }
    };

    const validate = (values) => {
        const errors = {};
        if (!values.nombre) {
            errors.nombre = 'Campo requerido';
        } else if (!/^[A-Za-zÑñÁÉÍÓÚáéíóú\s]+$/.test(values.nombre)) { // Verifica si solo contiene letras y espacios
            errors.nombre = 'El nombre solo debe contener letras';
        }
        return errors;
    }

    // Usar selected para sacar los datos del empleado
    return (
        <CustomModal Open={Open} setOpen={setOpen} handleClose={handleClose}>
            <div className="flex items-center mb-2">
                <SecurityIcon className="w-6 h-6 mr-2" />
                <h1 className='text-lg font-bold fl'>Editar una subgerencia</h1>
            </div>
            {Selected && (
                <Formik
                    initialValues={{
                        nombre: Selected.nombres || '',
                        
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
    )
}

export default EditSubgerencia