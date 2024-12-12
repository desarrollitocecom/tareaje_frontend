import React, { useEffect, useRef, useState } from 'react';
import CustomModal from '../../Components/Modal/CustomModal';
import SecurityIcon from '@mui/icons-material/Security';
import { Button, TextField, Autocomplete } from '@mui/material';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import useFetch from '../../Components/hooks/useFetch';
import CustomSwal, { swalError } from '../../helpers/swalConfig';
import useFetchData from '../../Components/hooks/useFetchData';
import dayjs from 'dayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';

const EditDescanso = ({ Selected, setSelected, refreshData }) => {
    const { patchData } = useFetch();
    const [Open, setOpen] = useState(false);
    const [empleados, setEmpleados] = useState([]);
    const [dniInputValue, setDniInputValue] = useState('');
    const [selectedEmpleado, setSelectedEmpleado] = useState(null);
    const { token } = useSelector((state) => state.auth);
    const { fetchEmpleados } = useFetchData(token);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingAutoComplete, setisLoadingAutoComplete] = useState(false)
    const timeoutRef = useRef(null);

    // Efecto para cargar empleados
    useEffect(() => {
        const loadEmpleados = async () => {
            const result = await fetchEmpleados();
            if (!result.error) {
                setEmpleados(result.data);
            } else {
                console.error("Error al cargar empleados:", result.error);
            }
        };
        loadEmpleados();
    }, []);

    // Manejo de datos al abrir el formulario de edición
    useEffect(() => {
        if (Selected) {
            setOpen(true);
            setisLoadingAutoComplete(true)
            fetchEmpleados(`?dni=${Selected.dni.trim()}`)
                .then((empleados) => {
                    setEmpleados(empleados.data);
                    const empleadoSeleccionado = empleados.data.find(emp => emp.dni === Selected.dni);
                    setSelectedEmpleado(empleadoSeleccionado || null);
                    formik.setFieldValue('dni', empleadoSeleccionado?.dni || '');
                    formik.setFieldValue('nombre', empleadoSeleccionado?.nombres || '');
                    formik.setFieldValue('apellido', empleadoSeleccionado?.apellidos || '');
                    formik.setFieldValue('id_empleado', empleadoSeleccionado?.id || '');
                    setRangeDates([{
                        startDate: dayjs(Selected['fecha de inicio']).toDate(),
                        endDate: dayjs(Selected['fecha de fin']).toDate(),
                        key: 'selection',
                    }]);
                }).finally(() => {
                    setisLoadingAutoComplete(false)
                })

            formik.setFieldValue('observacion', Selected.observacion);

        }
    }, [Selected]);

    // Manejo del cierre del modal
    const handleClose = () => {
        setSelected(null);
        setOpen(false);
        formik.resetForm();
    };

    // Formulario con Formik
    const formik = useFormik({
        initialValues: {
            dni: '',
            nombre: '',
            apellido: '',
            observacion: '',
            id_empleado: '',
            fecha: dayjs(),
        },
        validate: (values) => {
            const errors = {};
            if (!values.dni) {
                errors.dni = 'Debe elegir un dni';
            }
            if (!values.fecha) {
                errors.fecha = 'Debe seleccionar una fecha';
            }
            if (!values.observacion) {
                errors.observacion = 'Debe escribir un observacion';
            }
            return errors;
        },
        onSubmit: (values) => {
            const data = {
                id_empleado: values.id_empleado,
                fecha: values.fecha.format('YYYY-MM-DD'),
                observacion: values.observacion,
            };
            patchData(`${import.meta.env.VITE_APP_ENDPOINT}/descansos/${Selected.id}`, data, token, true)
                .then((res) => {
                    if (res.status) {
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
                    } else {
                        swalError(res.error.response.data);
                    }
                })
                .catch((err) => {
                    swalError(err.response?.data);

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
                <h1 className="text-lg font-bold">Editar Descanso</h1>
            </div>

            <form onSubmit={formik.handleSubmit} className="mt-8">
                <div className="flex flex-col gap-3">
                    {/* Autocomplete para seleccionar empleado */}
                    <Autocomplete
                        options={empleados}
                        getOptionLabel={(option) => `${option.dni} - ${option.nombres} ${option.apellidos}`}
                        value={selectedEmpleado}
                        inputValue={dniInputValue}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        loading={isLoadingAutoComplete}
                        onInputChange={(event, newInputValue) => {
                            setDniInputValue(newInputValue);

                            // Lógica de búsqueda y filtrado de empleados con timeout
                            setisLoadingAutoComplete(true);
                            setEmpleados([]);

                            if (timeoutRef.current) {
                                clearTimeout(timeoutRef.current);
                            }

                            timeoutRef.current = setTimeout(() => {
                                if (!newInputValue.trim()) {
                                    fetchEmpleados().then((empleados) => setEmpleados(empleados.data));
                                } else {
                                    const firstChar = newInputValue.trim().charAt(0);
                                    const paramKey = /^[0-9]$/.test(firstChar) ? 'dni' : 'search';
                                    fetchEmpleados(`?${paramKey}=${newInputValue.trim()}`)
                                        .then((empleados) => {
                                            setEmpleados(empleados.data);
                                        })
                                        .catch((error) => {
                                            console.error("Error fetching empleados:", error);
                                        })
                                        .finally(() => {
                                            setisLoadingAutoComplete(false);
                                        });
                                }
                            }, 800);
                        }}
                        onChange={(event, value) => {
                            setSelectedEmpleado(value || null);
                            if (value) {
                                setDniInputValue(`${value.dni} - ${value.nombres} ${value.apellidos}`);
                                formik.setFieldValue('dni', value.dni);
                                formik.setFieldValue('nombre', value.nombres);
                                formik.setFieldValue('apellido', value.apellidos);
                                formik.setFieldValue('id_empleado', value.id);
                            } else {
                                setDniInputValue('');
                                formik.setFieldValue('dni', '');
                                formik.setFieldValue('nombre', '');
                                formik.setFieldValue('apellido', '');
                                formik.setFieldValue('id_empleado', '');
                            }

                            formik.setTouched({ ...formik.touched, dni: false }); // Marcar como tocado
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="DNI"
                                variant="outlined"
                                fullWidth
                                size="small"
                                name='dni'
                                error={formik.touched.dni && Boolean(formik.errors.dni)}  // Corrección aquí
                                onBlur={formik.handleBlur}
                                helperText={formik.touched.dni && formik.errors.dni}     // Corrección aquí
                            />
                        )}
                    />


                    <div className="flex gap-2">

                        {/* Campos de Nombre y Apellido */}
                        <TextField
                            id="nombre"
                            label="Nombre"
                            variant="outlined"
                            size="small"
                            name='nombre'
                            value={formik.values.nombre}
                            onChange={formik.handleChange}
                            error={formik.touched.nombre && Boolean(formik.errors.nombre)}
                            fullWidth
                            disabled
                        />
                        <TextField
                            id="apellido"
                            label="Apellido"
                            variant="outlined"
                            size="small"
                            name='apellido'
                            value={formik.values.apellido}
                            onChange={formik.handleChange}
                            error={formik.touched.apellido && Boolean(formik.errors.apellido)}
                            fullWidth
                            disabled
                        />
                    </div>


                    {/* Picker para seleccionar la fecha */}
                    <StaticDatePicker
                        displayStaticWrapperAs="desktop"
                        openTo="day"
                        value={formik.values.fecha}
                        onChange={(value) => formik.setFieldValue('fecha', value)}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </div>

                {/* Campo de Observación */}
                <TextField
                    label="Observacion"
                    value={formik.values.observacion}
                    onChange={(e) => {
                        formik.setFieldValue('observacion', e.target.value);
                        formik.setTouched({ ...formik.touched, observacion: true }); // Marcar el campo como tocado
                    }}
                    variant="outlined"
                    size="small"
                    rows={3}
                    fullWidth
                    error={formik.touched.observacion && Boolean(formik.errors.observacion)}
                    helperText={formik.touched.observacion && formik.errors.observacion}
                />

                <div className="flex justify-between pt-5">
                    <Button type="button" size="small" variant="contained" color="inherit" onClick={handleClose}>
                        Cerrar
                    </Button>
                    <Button type="submit" size="small" variant="contained" color="success" disabled={formik.isSubmitting}>
                        Editar
                    </Button>
                </div>
            </form>
        </CustomModal>
    );
};

export default EditDescanso;
