import React, { useEffect, useState } from 'react';
import CustomModal from '../../Components/Modal/CustomModal';
import SecurityIcon from '@mui/icons-material/Security';
import { Button, TextField } from '@mui/material';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import useFetch from '../../Components/hooks/useFetch';
import CustomSwal, { swalError } from '../../helpers/swalConfig';
import dayjs from 'dayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';

const EditFeriado = ({ Selected, setSelected, refreshData }) => {
    const { patchData } = useFetch();
    const [Open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { token } = useSelector((state) => state.auth);

    // Manejo del modal al seleccionar un feriado
    useEffect(() => {
        if (Selected) {
            setOpen(true);
            formik.setFieldValue('nombre', Selected.nombre || '');
            formik.setFieldValue('fecha', dayjs(Selected.fecha));

        }
    }, [Selected]);

    // Cerrar Modal
    const handleClose = () => {
        setSelected(null);
        formik.resetForm();
        setOpen(false);
    };

    // Formulario con Formik
    const formik = useFormik({
        initialValues: {
            nombre: '',
            fecha: dayjs(),
        },

        validate: (values) => {
            const errors = {};
            if (!values.nombre) {
                errors.nombre = 'Debe escribir un nombre';
            } else if (!/^[A-Za-zÑñÁÉÍÓÚáéíóú\s]+$/.test(values.nombre)) {
                errors.nombre = 'El nombre solo debe contener letras y espacios';
            }
            if (!values.fecha) {
                errors.fecha = 'Debe seleccionar una fecha';
            }
            return errors;
        },
        onSubmit: (values) => {
            const data = {
                nombre: values.nombre,
                fecha: values.fecha.format('YYYY-MM-DD'),
            };
            patchData(`${import.meta.env.VITE_APP_ENDPOINT}/feriados/${Selected.id}`, data, token, true)
                .then((res) => {
                    CustomSwal.fire({
                        icon: 'success',
                        title: res.data.message,
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 4000,
                    });
                    refreshData();
                    handleClose();
                })
                .catch((error) => {
                    swalError(error);

                })
                .finally(() => {
                    setIsLoading(false);
                });
        },
    });

    return (
        <CustomModal Open={Open} setOpen={setOpen} handleClose={handleClose} isLoading={isLoading || formik.isSubmitting}>
            <div className="flex items-center mb-2">
                <SecurityIcon className="w-6 h-6 mr-2" />
                <h1 className="text-lg font-bold">Editar Feriado</h1>
            </div>
            <form onSubmit={formik.handleSubmit} className="mt-8">
                <div className="flex flex-col gap-3">
                    {/* Campo de Nombre del Feriado */}
                    <TextField
                        label="Nombre"
                        value={formik.values.nombre}
                        onChange={(e) => {
                            formik.setFieldValue('nombre', e.target.value);
                            formik.setTouched({ ...formik.touched, nombre: true }); // Marcar el campo como tocado
                        }}
                        variant="outlined"
                        size="small"
                        multiline
                        fullWidth
                        error={formik.touched.nombre && Boolean(formik.errors.nombre)}
                        helperText={formik.touched.nombre && formik.errors.nombre}
                    />


                    {/* Selector de Fecha */}
                        <StaticDatePicker
                            displayStaticWrapperAs="desktop"
                            openTo="day"
                            value={formik.values.fecha}
                            onChange={(value) => formik.setFieldValue('fecha', value)}
                            renderInput={(params) => <TextField {...params} />}
                        />
                </div>

                <div className="flex justify-between pt-5">
                    <Button type="button" size="small" variant="contained" color="inherit" onClick={handleClose}>
                        Cerrar
                    </Button>
                    <Button type="submit" size="small" variant="contained" color="success" disabled={formik.isSubmitting || isLoading}>
                        Actualizar
                    </Button>
                </div>
            </form>
        </CustomModal>
    );
};

export default EditFeriado;
