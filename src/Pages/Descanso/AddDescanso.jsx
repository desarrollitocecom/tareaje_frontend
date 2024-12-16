import React, { useState, useEffect, useRef } from 'react';
import CustomModal from '../../Components/Modal/CustomModal';
import AddIcon from '@mui/icons-material/Add';
import { Button, IconButton, Tooltip, TextField, Autocomplete, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import { useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import useFetch from '../../Components/hooks/useFetch';
import CustomSwal, { swalError } from '../../helpers/swalConfig';
import useFetchData from '../../Components/hooks/useFetchData';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { TIPO_dESCANSOS } from '../../helpers/Constants';

const AddDescanso = ({ refreshData }) => {
    const { postData } = useFetch();
    const [Open, setOpen] = useState(false);
    const { token } = useSelector((state) => state.auth);
    const { fetchEmpleados } = useFetchData(token);
    const [empleados, setEmpleados] = useState([]);
    const [fecha, setFecha] = useState(dayjs('2022-04-17'));
    const [dniInputValue, setDniInputValue] = useState('');
    const [selectedEmpleado, setSelectedEmpleado] = useState(null);
    const [isLoading, setisLoading] = useState(false)
    const timeoutRef = useRef(null);

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
    };

    // Validación de los campos del formulario
    const validate = (values) => {

    };

    const handleSubmit = async (values, { resetForm }) => {
        try {
            const response = await postData(`${import.meta.env.VITE_APP_ENDPOINT}/descansos`, values, token);
            if (response.status) {
                setOpen(false);
                CustomSwal.fire('Agregado', 'El descanso ha sido agregado correctamente.', 'success');
                handleClose(resetForm);
                refreshData();
            } else {
                swalError(response.error.response.data);

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
            <Formik
                initialValues={{
                    dni: '',
                    nombre: '',
                    apellido: '',
                    tipo: '',
                    fecha: fecha,
                    observacion: '',
                    id_empleado: ''
                }}
                validate={validate}
                onSubmit={handleSubmit}
            >
                {({ errors, touched, setFieldValue, values, isSubmitting }) => (
                    <CustomModal Open={Open} setOpen={setOpen} handleClose={handleClose} isLoading={isSubmitting} >
                        <div className="flex items-center mb-2">
                            <SecurityIcon className="w-6 h-6 mr-2" />
                            <h1 className='text-lg font-bold'>Añadir un Descanso</h1>
                        </div>
                        <Form>
                            <div className="mb-3">
                                <Autocomplete
                                    size='small'
                                    options={empleados}
                                    getOptionLabel={(option) => `${option.dni} - ${option.nombres} ${option.apellidos}`}
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
                                    onInputChange={(e) => {
                                        setisLoading(true);
                                        setEmpleados([]);

                                        if (timeoutRef.current) {
                                            clearTimeout(timeoutRef.current);
                                        }

                                        timeoutRef.current = setTimeout(() => {
                                            if (!e.target.value) {
                                                fetchEmpleados().then((empleados) => setEmpleados(empleados.data));
                                            } else {
                                                const firstChar = e.target.value.trim().charAt(0);
                                                const paramKey = /^[0-9]$/.test(firstChar) ? 'dni' : 'search';
                                                fetchEmpleados(`?${paramKey}=${e.target.value.trim()}`)
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
                                    renderOption={(props, option) => (
                                        <li {...props} key={option.id}>{`${option.dni} - ${option.nombres} ${option.apellidos}`}</li>
                                    )}
                                    loading={isLoading}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="DNI"
                                            variant="outlined"
                                            fullWidth
                                        />
                                    )}
                                />
                            </div>

                            <div className="flex flex-col md:flex-row gap-4 mb-3">
                                <Field as={TextField} label="Nombre" variant="outlined" fullWidth name="nombre" disabled size="small" />
                                <Field as={TextField} label="Apellido" variant="outlined" fullWidth name="apellido" disabled size="small" />
                            </div>

                            <div className="mb-3">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <StaticDatePicker
                                        displayStaticWrapperAs="desktop"
                                        value={fecha}
                                        onChange={(date) => {
                                            setFecha(date);
                                            setFieldValue('fecha', date.format('YYYY-MM-DD')); // Formatear la fecha
                                        }}
                                        renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                                    />
                                </LocalizationProvider>
                            </div>

                            <div className='mb-3'>
                                <FormControl fullWidth size='small'>
                                    <InputLabel id="demo-simple-select-label">Tipo de descanso</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="Tipó de descanso"
                                        name="tipo"
                                        value={values.tipo}
                                        onChange={(e) => setFieldValue('tipo', e.target.value)}
                                        size="small"
                                    >
                                        {TIPO_dESCANSOS.map((item) => (
                                            <MenuItem key={item} value={item}>{item}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>

                            <div className="mb-3">
                                <Field
                                    as={TextField}
                                    label="Observación"
                                    variant="outlined"
                                    fullWidth
                                    name="observacion"
                                    multiline
                                    size="small"
                                />
                            </div>

                            <div className="flex justify-between pt-5">
                                <Button type="button" variant="contained" color="inherit" onClick={handleClose} size="small">Cerrar</Button>
                                <Button type="submit" variant="contained" color="success" size="small">Agregar</Button>
                            </div>
                        </Form>
                    </CustomModal>
                )}
            </Formik>
        </>
    );
};

export default AddDescanso;
