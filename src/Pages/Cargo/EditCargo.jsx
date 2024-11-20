import React, { useEffect, useState } from 'react';
import CustomModal from '../../Components/Modal/CustomModal';
import SecurityIcon from '@mui/icons-material/Security';
import { Button, TextField, MenuItem } from '@mui/material';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import CustomSwal, { swalError } from '../../helpers/swalConfig';
import useFetch from '../../Components/hooks/useFetch';
import useFetchData from '../../Components/hooks/useFetchData';

const EditCargo = ({ Selected, setSelected, refreshData }) => {
    const [Open, setOpen] = useState(false);
    const [subgerencias, setSubgerencias] = useState([]);
    const [isLoading, setisLoading] = useState(false);

    const { token } = useSelector((state) => state.auth);
    const { patchData } = useFetch();
    const { fetchSubgerencias } = useFetchData(token);

    useEffect(() => {
        setOpen(Selected !== null);
        if (Selected) {
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
                .finally(() => {
                    setisLoading(false);
                    if (Selected) {
                        formik.setFieldValue('nombre', Selected.nombres || '');
                        formik.setFieldValue('sueldo', Selected.sueldo || '');
                        formik.setFieldValue('subgerencia', Selected.subgerencia || '');
                    }
                });
        }
    }, [Selected]);

    const handleClose = () => {
        setSelected(null);
        formik.resetForm();
    };

    const formik = useFormik({
        initialValues: {
            nombre: '',
            sueldo: '',
            subgerencia: '',
        },
        validate: (values) => {
            const errors = {};
            if (!values.nombre) {
                errors.nombre = 'Campo requerido';
            } else if (!/^[A-Za-zÑñÁÉÍÓÚáéíóú\s]+$/.test(values.nombre)) {
                errors.nombre = 'El nombre solo debe contener letras';
            }
            if (!values.sueldo) {
                errors.sueldo = 'Campo requerido';
            }
            if (!values.subgerencia) {
                errors.subgerencia = 'Campo requerido';
            }
            return errors;
        },
        onSubmit: (values) => {
            const selectedSubgerencia = subgerencias.find(
                (subgerencia) => subgerencia.nombre === values.subgerencia
            );

            if (!selectedSubgerencia) {
                CustomSwal.fire(
                    'Error',
                    'Subgerencia no válida',
                    'error'

                );
                return;
            }

            const dataToSubmit = {
                nombre: values.nombre,
                sueldo: values.sueldo,
                id_subgerencia: selectedSubgerencia.id,
            };

            patchData(`${import.meta.env.VITE_APP_ENDPOINT}/cargos/${Selected.id}`, dataToSubmit, token)
                .then((res) => {


                    if (res.status) {
                        CustomSwal.fire(

                            'Modificado',
                            'El cargo ha sido modificado correctamente.',
                            'success'
                        );
                        refreshData();
                        handleClose();
                    } else {
                        const erroresArray = response?.error?.response?.data?.errores || [];
                        swalError({
                            message: 'Ocurrió un error al modificar el cargo',
                            data: erroresArray,
                        });
                    }
                })
                .catch((error) => {
                    console.error('Error en la solicitud:', error);
                    swalError({
                        message: 'Error inesperado al modificar el cargo',
                        data: [error.message],
                    });
                })
                .finally(() => {
                    formik.setSubmitting(false);
                });
        },
    });

    return (
        <CustomModal Open={Open} setOpen={setOpen} handleClose={handleClose} isLoading={isLoading || formik.isSubmitting}>
            <div className="flex items-center mb-2">
                <SecurityIcon className="w-6 h-6 mr-2" />
                <h1 className="text-lg font-bold">Editar un cargo</h1>
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
                        name="subgerencia"
                        value={formik.values.subgerencia}
                        onChange={formik.handleChange}
                        error={formik.touched.subgerencia && Boolean(formik.errors.subgerencia)}
                        helperText={formik.touched.subgerencia && formik.errors.subgerencia}
                        fullWidth
                    >
                        {subgerencias.map((subgerencia) => (
                            <MenuItem key={subgerencia.id} value={subgerencia.nombre}>
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
                        Actualizar
                    </Button>
                </div>
            </form>
        </CustomModal>
    );
};

export default EditCargo;
