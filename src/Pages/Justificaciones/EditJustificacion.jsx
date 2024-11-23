import React, { useEffect, useState } from 'react'
import CustomModal from '../../Components/Modal/CustomModal'
import SecurityIcon from '@mui/icons-material/Security';
import { Button, TextField } from '@mui/material';
import { useSelector } from 'react-redux';
import useFetch from '../../Components/hooks/useFetch';
import CustomSwal, { swalError } from '../../helpers/swalConfig';
import { useFormik } from 'formik';

const EditJustificacion = ({ Selected, setSelected, refreshData }) => {
    const [Open, setOpen] = useState(false);
    const { token } = useSelector((state) => state.auth);
    const { patchData } = useFetch();

    useEffect(() => {
        if (Selected) {
            setOpen(true);
            formik.setValues({
                descripcion: Selected.descripcion || '',
            });
        }
    }, [Selected]);

    const handleClose = () => {
        setSelected(null);
        formik.resetForm();
        setOpen(false);
    };

    const formik = useFormik({
        initialValues: {
            descripcion: '',
        },
        validate: (values) => {
            const errors = {};
            if (!values.descripcion) {
                errors.descripcion = 'Este campo es obligatorio';
            } else if (!/^[a-zA-Z0-9\s.,]+$/.test(values.descripcion)) { 
                errors.descripcion = 'La descripción solo debe contener letras, números y puntuación básica';
            }
            return errors;
        },
        onSubmit: async (values) => {
            try {
                const response = await patchData(`${import.meta.env.VITE_APP_ENDPOINT}/justificaciones/${Selected.id}`, values, token, true);
                if (response.status) {
                    CustomSwal.fire({
                        icon: 'success',
                        title: response.data.message,
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 4000,
                    });
                    refreshData();
                    handleClose();
                } else {
                    throw new Error(response.error || 'Error desconocido');
                }
            } catch (err) {
                const errorMessage = err.response?.data?.message || err.message || 'Error desconocido';
                swalError(errorMessage);
                console.error(err);
            } finally {
                formik.setSubmitting(false);
            }
        },
    });

    return (
        <CustomModal Open={Open} setOpen={setOpen} handleClose={handleClose}>
            <div className="flex items-center mb-2">
                <SecurityIcon className="w-6 h-6 mr-2" />
                <h1 className='text-lg font-bold'>Editar Justificación</h1>
            </div>
            <form onSubmit={formik.handleSubmit} className='mt-8'>
                <div className='flex flex-col gap-3'>
                    <TextField
                        fullWidth
                        id="descripcion"
                        label="Descripción"
                        variant="outlined"
                        size="small"
                        helperText="Ingrese una descripción"
                        name='descripcion'
                        value={formik.values.descripcion}
                        onChange={formik.handleChange}
                        error={formik.touched.descripcion && Boolean(formik.errors.descripcion)}
                        multiline
                        rows={3}
                    />
                </div>
                <div className='flex justify-between pt-5'>
                    <Button type='button' size='small' variant="contained" color="inherit" onClick={handleClose}>Cerrar</Button>
                    <Button type='submit' size='small' variant="contained" color="success" disabled={formik.isSubmitting}>Editar</Button>
                </div>
            </form>
        </CustomModal>
    );
};

export default EditJustificacion;
