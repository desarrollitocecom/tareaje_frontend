import React, { useState, useEffect, useRef } from 'react';
import CustomModal from '../../Components/Modal/CustomModal';
import AddIcon from '@mui/icons-material/Add';
import { Button, IconButton, Tooltip, TextField, Autocomplete } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import { useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import useFetch from '../../Components/hooks/useFetch';
import CustomSwal, { swalError } from '../../helpers/swalConfig';
import useFetchData from '../../Components/hooks/useFetchData';
import { DateRange } from 'react-date-range';
import es from 'date-fns/locale/es';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { FormatoEnvioFecha } from '../../helpers/GeneralFunctions';

const AddVacaciones = ({ refreshData }) => {
    const { postData } = useFetch();
    const [Open, setOpen] = useState(false);
    const [empleados, setEmpleados] = useState([]);
    const { token } = useSelector((state) => state.auth);
    const { fetchEmpleados } = useFetchData(token);
    const [isLoading, setisLoading] = useState(false)
    const timeoutRef = useRef(null);

    const [rangeDates, setRangeDates] = useState([{
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
    }]);
    const [dniInputValue, setDniInputValue] = useState('');
    const [selectedEmpleado, setSelectedEmpleado] = useState(null);

    useEffect(() => {
        fetchEmpleados().then((empleados) => {
            setEmpleados(empleados.data);
        });
    }, []);

    const handleClose = (resetForm) => {
        setOpen(false);
        resetForm();
        setDniInputValue('');
        setSelectedEmpleado(null);
        setRangeDates([{
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }]);
    };

    const validate = (values) => {
        const errors = {};

        if (!values.dni) {
            errors.dni = 'Campo requerido';
        } else if (!/^\d{8}$/.test(values.dni)) {
            errors.dni = 'El DNI debe tener 8 dígitos numéricos';
        }

        if (!values.f_inicio) {
            errors.f_inicio = 'Campo requerido';
        }

        if (!values.f_fin) {
            errors.f_fin = 'Campo requerido';
        }

        return errors;
    };

    const handleSubmit = async (values, { resetForm }) => {
        try {
            const response = await postData(`${import.meta.env.VITE_APP_ENDPOINT}/vacaciones`, values, token);
            if (response.status) {
                CustomSwal.fire('Agregado', 'Las vacaciones han sido agregadas correctamente.', 'success');
                refreshData();
                handleClose(resetForm);
            } else {
                swalError(res.error.response.data);
            }
        } catch (error) {
            CustomSwal.fire({
                icon: 'error',
                title: 'Error en la solicitud',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 4000
            });
        }
    };

    return (
        <>
            <Tooltip title="Añadir" placement='top' arrow>
                <IconButton aria-label="add" onClick={() => setOpen(true)}>
                    <AddIcon />
                </IconButton>
            </Tooltip>
            <CustomModal Open={Open} setOpen={setOpen} handleClose={() => setOpen(false)}>
                <div className="flex items-center mb-2">
                    <SecurityIcon className="w-6 h-6 mr-2" />
                    <h1 className='text-lg font-bold'>Añadir unas Vacaciones</h1>
                </div>
                <Formik
                    initialValues={{
                        dni: '',
                        apellido: '',
                        nombre: '',
                        f_inicio: FormatoEnvioFecha(new Date()),
                        f_fin: FormatoEnvioFecha(new Date()),
                        id_empleado: ''
                    }}
                    validate={validate}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched, setFieldValue, resetForm }) => (
                        <Form>
                            <div className="mb-3">
                                <Autocomplete
                                    options={empleados}
                                    getOptionLabel={(option) =>
                                        `${option.dni} - ${option.nombres} ${option.apellidos}`
                                    }
                                    value={selectedEmpleado}
                                    inputValue={dniInputValue}
                                    loading={isLoading}
                                    onInputChange={(event, newInputValue) => {
                                        setDniInputValue(newInputValue);

                                        // Lógica de búsqueda y filtrado de empleados con timeout
                                        setisLoading(true);
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
                                                        setisLoading(false);
                                                    });
                                            }
                                        }, 800);
                                    }}
                                    onChange={(event, value) => {
                                        setSelectedEmpleado(value || null);
                                        if (value) {
                                            setFieldValue('dni', value.dni);
                                            setFieldValue('nombre', value.nombres);
                                            setFieldValue('apellido', value.apellidos);
                                            setFieldValue('id_empleado', value.id);
                                        } else {
                                            setFieldValue('dni', '');
                                            setFieldValue('nombre', '');
                                            setFieldValue('apellido', '');
                                            setFieldValue('id_empleado', '');
                                        }
                                        setDniInputValue(value ? `${value.dni} - ${value.nombres} ${value.apellidos}` : '');
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="DNI"
                                            variant="outlined"
                                            error={touched.dni && Boolean(errors.dni)}
                                            helperText={touched.dni && errors.dni}
                                            fullWidth
                                            size="small"
                                        />
                                    )}
                                />
                            </div>

                            <div className="flex flex-col md:flex-row gap-4 mb-3">
                                <Field as={TextField} label="Nombre" variant="outlined" fullWidth name="nombre" disabled size="small" />
                                <Field as={TextField} label="Apellido" variant="outlined" fullWidth name="apellido" disabled size="small" />
                            </div>

                            {/* Centrar rango de fechas con tamaño pequeño */}
                            <div className="mb-3 flex justify-center">
                                <div className="w-full md:w-3/4 lg:w-1/2">
                                    <DateRange
                                        editableDateInputs
                                        onChange={(item) => {
                                            setFieldValue('f_inicio', item.selection.startDate);
                                            setFieldValue('f_fin', item.selection.endDate);
                                            setRangeDates([item.selection]);
                                        }}
                                        moveRangeOnFirstSelection={false}
                                        ranges={rangeDates}
                                        locale={es}
                                    />

                                    {/* Mostrar error debajo del campo de fecha */}
                                    {errors.f_inicio && touched.f_inicio && (
                                        <div className="text-red-500 text-sm">Fecha de inicio: {errors.f_inicio}</div>
                                    )}

                                    {errors.f_fin && touched.f_fin && (
                                        <div className="text-red-500 text-sm">Fecha de fin: {errors.f_fin}</div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-between pt-5">
                                <Button type="button" variant="contained" onClick={() => handleClose(resetForm)} size="small">Cerrar</Button>
                                <Button type="submit" variant="contained" color="success" size="small">Agregar</Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </CustomModal>
        </>
    );
};

export default AddVacaciones;
