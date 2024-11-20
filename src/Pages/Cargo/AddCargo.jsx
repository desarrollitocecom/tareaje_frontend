import React, { useEffect, useState } from 'react';
import CustomModal from '../../Components/Modal/CustomModal';
import AddIcon from '@mui/icons-material/Add';
import { Button, IconButton, Tooltip, TextField, MenuItem } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import CustomSwal, { swalError } from '../../helpers/swalConfig';
import useFetch from '../../Components/hooks/useFetch';
import useFetchData from '../../Components/hooks/useFetchData';

const AddCargo = ({ refreshData }) => {
    const { postData } = useFetch();
    const { token } = useSelector((state) => state.auth);
    const { fetchSubgerencias } = useFetchData(token);

    const [Open, setOpen] = useState(false);
    const [subgerencias, setSubgerencias] = useState([]);
    const [isLoading, setisLoading] = useState(false);

    useEffect(() => {
        if (Open) {

            setisLoading(true);
            fetchSubgerencias()
                .then((res) => {
                    if (!res.error) {
                        setSubgerencias(res.data);
                    } else {
                        throw new Error(res.error);
                    }
                })
                .catch((err) => {
                    CustomSwal.fire(
                        'Error',
                        'Error al obtener las subgerencias.',
                        'error'
                    );
                    console.error(err);
                })
                .finally(() => setisLoading(false));
        }
    }, [Open]);

    const handleClose = () => {
        formik.resetForm();
        setOpen(false);
    };

    const formik = useFormik({
        initialValues: {
            nombre: '',
            sueldo: '',
            id_subgerencia: '',
        },
        validate: (values) => {
            const errors = {};
            // Validación del campo nombre
            if (!values.nombre) {
                errors.nombre = 'Campo requerido';
            } else if (!/^[A-Za-zÑñÁÉÍÓÚáéíóú\s]+$/.test(values.nombre)) {
                errors.nombre = 'El nombre solo debe contener letras'; // Mensaje coincidente con el backend
            }

            if (!values.sueldo) {
                errors.sueldo = 'Campo requerido';
            }
            if (!values.id_subgerencia) {
                errors.id_subgerencia = 'Campo requerido';
            }
            return errors;
        },
        onSubmit: (values) => {
            postData(`${import.meta.env.VITE_APP_ENDPOINT}/cargos`, values, token)
                .then((res) => {
                    
                    if (res.status) {
                        CustomSwal.fire(
                            'Agregado',
                            'El cargo ha sido agregado correctamente.',
                            'success'
                        );
                        refreshData();
                        handleClose();
                    } else {
                        const erroresArray = response?.error?.response?.data?.errores || [];
                        swalError({
                            message: 'Ocurrió un error al agregar el cargo',
                            data: erroresArray,
                        });
                    }
                })
                .catch((error) => {
                    console.error('Error en la solicitud:', error);
                    swalError({
                        message: 'Error inesperado al agregar el cargo',
                        data: [error.message],
                    });
                })
                .finally(() => {
                    formik.setSubmitting(false);
                });
        },
    });

    return (
        <>
            <Tooltip title="Añadir" placement="top" arrow>
                <IconButton aria-label="add" onClick={() => setOpen(true)}>
                    <AddIcon />
                </IconButton>
            </Tooltip>
            <CustomModal Open={Open} setOpen={setOpen} handleClose={handleClose} isLoading={isLoading || formik.isSubmitting}>
                <div className="flex items-center mb-2">
                    <SecurityIcon className="w-6 h-6 mr-2" />
                    <h1 className="text-lg font-bold">Añadir un Cargo</h1>
                </div>
                <form onSubmit={formik.handleSubmit} className="mt-8">
                    <div className="flex flex-col gap-3">
                        <TextField
                            label="Nombre"
                            variant="outlined"
                            size="small"
                            name="nombre"
                            value={formik.values.nombre}
                            onChange={formik.handleChange}
                            error={formik.touched.nombre && Boolean(formik.errors.nombre)}
                            helperText={formik.touched.nombre && formik.errors.nombre}
                            fullWidth
                        />
                        <TextField
                            label="Sueldo"
                            variant="outlined"
                            size="small"
                            type="number"
                            name="sueldo"
                            value={formik.values.sueldo}
                            onChange={formik.handleChange}
                            error={formik.touched.sueldo && Boolean(formik.errors.sueldo)}
                            helperText={formik.touched.sueldo && formik.errors.sueldo}
                            fullWidth
                        />
                        <TextField
                            select
                            label="Subgerencia"
                            variant="outlined"
                            size="small"
                            name="id_subgerencia"
                            value={formik.values.id_subgerencia}
                            onChange={formik.handleChange}
                            error={formik.touched.id_subgerencia && Boolean(formik.errors.id_subgerencia)}
                            helperText={formik.touched.id_subgerencia && formik.errors.id_subgerencia}
                            fullWidth
                        >
                            {subgerencias.map((subgerencia) => (
                                <MenuItem key={subgerencia.id} value={subgerencia.id}>
                                    {subgerencia.nombre}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>
                    <div className="flex justify-between pt-5">
                        <Button type="button" size="small" variant="contained" color="inherit" onClick={handleClose}>
                            Cerrar
                        </Button>
                        <Button type="submit" size="small" variant="contained" color="success" disabled={formik.isSubmitting}>
                            Agregar
                        </Button>
                    </div>
                </form>
            </CustomModal>
        </>
    );
};

export default AddCargo;
