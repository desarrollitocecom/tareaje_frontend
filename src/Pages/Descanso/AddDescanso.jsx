import React, { useState, useEffect } from 'react';
import CustomModal from '../../Components/Modal/CustomModal';
import AddIcon from '@mui/icons-material/Add';
import { Button, IconButton, Tooltip, TextField, Autocomplete } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import { useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import useFetch from '../../Components/hooks/useFetch';
import CustomSwal from '../../helpers/swalConfig';
import useFetchData from '../../Components/hooks/useFetchData';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

const AddDescanso = () => {
    const { postData } = useFetch();
    const [Open, setOpen] = useState(false);
    const { token } = useSelector((state) => state.auth);
    const { fetchEmpleados } = useFetchData(token);
    const [empleados, setEmpleados] = useState([]);
    const [fecha, setFecha] = useState(dayjs('2022-04-17'));
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
            } else {
                // Extraemos los errores de forma segura
                const message = response?.error?.response?.data?.message || 'Ocurrió un error';
                const erroresArray = response?.error?.response?.data?.errores || [];
                const errores = erroresArray.length > 0
                    ? erroresArray.join(', ') // Unimos los elementos del array de errores
                    : 'No se encontraron detalles del error';

                // Mostramos la alerta
                CustomSwal.fire({
                    icon: 'error',
                    title: `${message}: ${errores}`,
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 4000,
                });

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
            <CustomModal Open={Open} setOpen={setOpen} handleClose={handleClose} >
                <div className="flex items-center mb-2">
                    <SecurityIcon className="w-6 h-6 mr-2" />
                    <h1 className='text-lg font-bold'>Añadir un Descanso</h1>
                </div>
                <Formik
                    initialValues={{
                        dni: '',
                        nombre: '',
                        apellido: '',
                        fecha: fecha,
                        observacion: '',
                        id_empleado: ''
                    }}
                    validate={validate}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched, setFieldValue }) => (
                        <Form>
                            <div className="mb-3">
                                <Autocomplete
                                    options={empleados}
                                    getOptionLabel={(option) =>
                                        `${option.dni} - ${option.nombres} ${option.apellidos}`
                                    }
                                    value={selectedEmpleado}
                                    inputValue={dniInputValue}
                                    onInputChange={(event, newInputValue) => {
                                        setDniInputValue(newInputValue);
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
                    )}
                </Formik>
            </CustomModal>
        </>
    );
};

export default AddDescanso;
