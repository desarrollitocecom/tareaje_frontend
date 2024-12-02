import React, { useEffect, useState } from 'react';
import CustomModal from '../../Components/Modal/CustomModal';
import SecurityIcon from '@mui/icons-material/Security';
import { Button, TextField, Autocomplete } from '@mui/material';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import useFetch from '../../Components/hooks/useFetch';
import useFetchData from '../../Components/hooks/useFetchData';
import CustomSwal from '../../helpers/swalConfig';
import { DateRange } from 'react-date-range';
import es from 'date-fns/locale/es';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import dayjs from 'dayjs';

const EditVacaciones = ({ Selected, setSelected, refreshData }) => {
    const { patchData } = useFetch();
    const [Open, setOpen] = useState(false);
    const [empleados, setEmpleados] = useState([]);
    const { token } = useSelector((state) => state.auth);
    const { fetchEmpleados } = useFetchData(token);
    const [dniInputValue, setDniInputValue] = useState('');
    const [selectedEmpleado, setSelectedEmpleado] = useState(null);

    // Estado para el rango de fechas
    const [rangeDates, setRangeDates] = useState([{
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    }]);

    // Cargar empleados al montar el componente
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
            const empleadoSeleccionado = empleados.find(emp => emp.dni === Selected.dni);
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
        }
    }, [Selected]);

    const handleClose = () => {
        setSelected(null);
        setOpen(false);
        formik.resetForm();
    };

    const formik = useFormik({
        initialValues: {
            dni: '',
            nombre: '',
            apellido: '',
            id_empleado: '',
            f_inicio: '',
            f_fin: '',

        },
        validate: (values) => {
            const errors = {};
            if (!values.dni) {
                errors.dni = 'Debe elegir un dni';
            }
            return errors;
        },
        onSubmit: async (values) => {
            try {
                const data = {
                    id_empleado: values.id_empleado,
                    f_inicio: dayjs(rangeDates[0].startDate).format('YYYY-MM-DD'),
                    f_fin: dayjs(rangeDates[0].endDate).format('YYYY-MM-DD'),
                };
        
                const res = await patchData(`${import.meta.env.VITE_APP_ENDPOINT}/vacaciones/${Selected.id}`, data, token, true);
        
                if (res.status) {
                    CustomSwal.fire({
                        icon: 'success',
                        title: res.data.message,
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 4000,
                    });
                    handleClose();
                    refreshData();
                }else{
                    swalError(res.error.response.data);
                }
            } catch (error) {
                console.error('Error al editar vacaciones:', error);
                CustomSwal.fire({
                    icon: 'error',
                    title: 'Error en la solicitud',
                    text: error.response?.data?.message || 'Hubo un problema al procesar tu solicitud.',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 4000,
                });
            }
        }
        
    });

    return (
        <CustomModal Open={Open} setOpen={setOpen} handleClose={() => setOpen(false)}>
            <div className="flex items-center mb-2">
                <SecurityIcon className="w-6 h-6 mr-2" />
                <h1 className="text-lg font-bold">Editar Vacaciones</h1>
            </div>

            <form onSubmit={formik.handleSubmit} className="mt-8">
                <div className="flex flex-col gap-3">

                    <Autocomplete
                        options={empleados}
                        getOptionLabel={(option) => `${option.dni} - ${option.nombres} ${option.apellidos}`}
                        value={selectedEmpleado}
                        inputValue={dniInputValue}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        onInputChange={(event, newInputValue) => {
                            setDniInputValue(newInputValue);
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
                            formik.setTouched({ ...formik.touched, dni: true }); // Marcar como tocado
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="DNI"
                                variant="outlined"
                                fullWidth
                                size="small"
                                error={formik.touched.dni && Boolean(formik.errors.dni)}  // Corrección aquí
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
                    <div className="mb-3 flex justify-center">
                        <div className="w-full md:w-3/4 lg:w-1/2">
                            <DateRange
                                editableDateInputs
                                onChange={(item) => {
                                    formik.setFieldValue('f_inicio', item.selection.startDate);
                                    formik.setFieldValue('f_fin', item.selection.endDate);
                                    setRangeDates([item.selection]);
                                    console.log(item.selection);
                                }}
                                moveRangeOnFirstSelection={false}
                                ranges={rangeDates}
                                locale={es}
                            />

                        </div>
                    </div>

                    <div className="flex justify-between pt-5">
                        <Button type="button" size="small" variant="contained" color="inherit" onClick={handleClose}>
                            Cerrar
                        </Button>
                        <Button type="submit" size="small" variant="contained" color="success" disabled={formik.isSubmitting}>
                            Editar
                        </Button>
                    </div>
                </div>

            </form>

        </CustomModal>
    );
};

export default EditVacaciones;
