import React, { useEffect, useState } from 'react'
import CustomModal from '../../Components/Modal/CustomModal'
import SecurityIcon from '@mui/icons-material/Security';
import { Button, IconButton, TextField, Tooltip } from '@mui/material';
import { useSelector } from 'react-redux';
import useFetch from '../../Components/hooks/useFetch';
import CustomSwal, { swalError } from '../../helpers/swalConfig';
import { useFormik } from 'formik';

const EditJustificacion = ({ Selected, setSelected }) => {
    const [Open, setOpen] = useState(false);
    const { token } = useSelector((state) => state.auth);
    const { patchData } = useFetch();
    const [isLoading, setisLoading] = useState(null)

    useEffect(() => {
        setOpen(Selected !== null);
        if (Selected) {
            setisLoading(true)
            const data = res.data;

            formik.setFieldValue('descripcion', data.descripcion);

        }
    },[Selected])
    

    const handleClose = () => {
        setSelected(null);
        formik.resetForm();
    }

    const formik = useFormik({
        initialValues: {
            descripcion: '',
        },
        validate: (values) => {
            const errors = {};
            if (!values.descripcion) {
                errors.descripcion = 'Este campo es obligatorio';
            } else if (!/^[a-zA-Z0-9\s.,]+$/.test(values.descripcion)) { 
                errors.descripcion = 'La descripción solo debe contener letras';
            }

            return errors;
        },
        onSubmit: (values) => {

            patchData(`${import.meta.env.VITE_APP_ENDPOINT}/justificaciones/${Selected.id}`, values, token, true).then((res) => {
                if (res.status) {
                    CustomSwal.fire({
                        icon: 'success',
                        title: res.data.message,
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 4000
                    });
                    refreshData();
                    handleClose();
                } else {
                    throw (response.error);
                }

            }).catch((err) => {
                swalError(err.response?.data);
                
                console.error(err);
            }).finally(() => {
                formik.setSubmitting(false);
            })
        }
    })

    return (
        <CustomModal Open={Open} setOpen={setOpen} handleClose={handleClose} isLoading={isLoading || formik.isSubmitting}>
            <div className="flex items-center mb-2">
                <SecurityIcon className="w-6 h-6 mr-2" />
                <h1 className='text-lg font-bold fl'>Editar una justificacion</h1>
            </div>
            <form onSubmit={formik.handleSubmit} className='mt-8'>
                <div className='flex flex-col gap-3'>
                    <div>
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
                </div>

                <div className='flex justify-between pt-5'>
                    <div></div>
                    <div className='flex gap-3'>
                        <Button type='button' size='small' variant="contained" color="inherit" onClick={handleClose}>Cerrar</Button>
                        <Button type='submit' size='small' variant="contained" color="success" disabled={formik.isSubmitting}>Editar</Button>
                    </div>
                </div>
            </form>
        </CustomModal>
    )
}

export default EditJustificacion