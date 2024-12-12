import React, { useState } from 'react';
import CustomModal from '../../Components/Modal/CustomModal';
import AddIcon from '@mui/icons-material/Add';
import { Button, IconButton, Tooltip, TextField } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import useFetch from '../../Components/hooks/useFetch';
import CustomSwal, { swalError } from '../../helpers/swalConfig';

const AddRegimen = ({ refreshData }) => {
    const [Open, setOpen] = useState(false);
    const { token } = useSelector((state) => state.auth);
    const { postData } = useFetch();

    const handleClose = () => {
        formik.resetForm();
        setOpen(false);
    };

    const formik = useFormik({
        initialValues: {
            nombre: '',
        },
        validate: (values) => {
            const errors = {};
            if (!values.nombre) {
                errors.nombre = 'Este campo es obligatorio';
            }
            return errors;
        },
        onSubmit: (values) => {
            postData(`${import.meta.env.VITE_APP_ENDPOINT}/regimenlaborales`, values, token, true)
                .then((res) => {
                    if (res.status) {
                        CustomSwal.fire({
                            icon: 'success',
                            title: 'El régimen laboral ha sido agregado correctamente.',
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 4000,
                        });
                        refreshData();
                        handleClose();
                    } else {
                        throw res.error;
                    }
                })
                .catch((err) => {
                    swalError(err.response?.data);
                    console.error(err);    
                }).finally(() => {
                    formik.setSubmitting(false);
                });
        },
    });

    return (
        <>
            <Tooltip title="Añadir" placement="top" arrow>
                <IconButton aria-label="add" onClick={() => setOpen(true)} size="small">
                    <AddIcon fontSize="small" />
                </IconButton>
            </Tooltip>
            <CustomModal Open={Open} setOpen={setOpen} handleClose={handleClose} isLoading={formik.isSubmitting}>
                <div className="flex items-center mb-2">
                    <SecurityIcon className="w-6 h-6 mr-2" />
                    <h1 className="text-lg font-bold">Añadir un Régimen</h1>
                </div>
                <form onSubmit={formik.handleSubmit}>
                    <div className="mb-3">
                        <TextField
                            label="Nombre"
                            variant="outlined"
                            fullWidth
                            size="small"
                            name="nombre"
                            value={formik.values.nombre}
                            onChange={formik.handleChange}
                            error={formik.touched.nombre && Boolean(formik.errors.nombre)}
                            helperText={formik.touched.nombre && formik.errors.nombre}
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
                            disabled={formik.isSubmitting}
                        >
                            Agregar
                        </Button>
                    </div>
                </form>
            </CustomModal>
        </>
    );
};

export default AddRegimen;
