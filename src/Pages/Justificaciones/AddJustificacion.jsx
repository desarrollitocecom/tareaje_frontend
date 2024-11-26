import React, { useState, useEffect, useRef } from 'react';
import CustomModal from '../../Components/Modal/CustomModal';
import AddIcon from '@mui/icons-material/Add';
import { Button, IconButton, Tooltip, TextField, Autocomplete } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import CustomSwal, { swalError } from '../../helpers/swalConfig';
import useFetch from '../../Components/hooks/useFetch';
import useFetchData from '../../Components/hooks/useFetchData';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { FormatoEnvioFecha } from '../../helpers/GeneralFunctions';

const AddJustificacion = ({ refreshData }) => {
    const [Open, setOpen] = useState(false);
    const { token } = useSelector((state) => state.auth);
    const [file, setFile] = useState(null);
    const { postData } = useFetch();
    const { fetchEmpleados } = useFetchData(token);
    const [empleados, setEmpleados] = useState([]);
    const [dniInputValue, setDniInputValue] = useState('');
    const [selectedEmpleado, setSelectedEmpleado] = useState(null);
    const fileInputRef = useRef()
    const [dateRange, setDateRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    });

    useEffect(() => {
        fetchEmpleados().then((response) => {
            setEmpleados(response.data);
        });
    }, []);

    const handleClose = () => {
        setOpen(false);
        setFile(null);
        setDniInputValue('');
        fileInputRef.current.value = "";
        setSelectedEmpleado(null);
        setDateRange({
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        });
        formik.resetForm();
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleConvertAndSubmit = async (values) => {
        if (!file) {
            swalError('Debe adjuntar un archivo válido.');
            return;
        }

        try {
            // Obtiene el ArrayBuffer del archivo
            const arrayBuffer = await file.arrayBuffer();
            const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
            const fileConvert = new File([blob], file.name || 'processed.pdf', { type: 'application/pdf' });

            // Construye el FormData
            const formData = new FormData();
            formData.append('documents', fileConvert);
            formData.append('id_empleado', values.idEmpleado);
            formData.append('f_inicio', FormatoEnvioFecha(dateRange.startDate));
            formData.append('f_fin', FormatoEnvioFecha(dateRange.endDate));
            formData.append('id_asistencia', values.idasistencia);
            formData.append('descripcion', values.descripcion);


            // Realiza la solicitud POST
            const response = await postData(`${import.meta.env.VITE_APP_ENDPOINT}/justificaciones/create`, formData, token);

            if (response.status) {
                CustomSwal.fire('Agregado', 'La justificación se ha registrado correctamente.', 'success');
                refreshData();
                formik.resetForm();
                handleClose();
            } else {
                swalError(response.error.response.data);
            }
        } catch (err) {
            console.error(err);
        }
        finally {
            formik.setSubmitting(false);
        }
    };

    const formik = useFormik({
        initialValues: { idEmpleado: '', descripcion: '', nombre: '', apellido: '', idasistencia: '' },
        validate: (values) => {
            const errors = {};
            if (!values.idEmpleado) {
                errors.idEmpleado = 'El DNI del empleado es requerido';
            }
            if (!values.descripcion) {
                errors.descripcion = 'La descripción es requerida';
            }
            if (!file) {
                errors.file = 'Debe adjuntar un archivo';
            }
            return errors;
        },
        onSubmit: (values) => {
            handleConvertAndSubmit(values);
        },

    })

    return (
        <>
            <Tooltip title="Añadir" placement="top" arrow>
                <IconButton aria-label="add" onClick={() => setOpen(true)}>
                    <AddIcon />
                </IconButton>
            </Tooltip>
            <CustomModal Open={Open} setOpen={setOpen} handleClose={handleClose} isLoading={formik.isSubmitting}>
                <div className="flex items-center mb-2">
                    <SecurityIcon className="w-6 h-6 mr-2" />
                    <h1 className="text-lg font-bold">Añadir una Justificación</h1>
                </div>
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div>
                        <Autocomplete
                            options={empleados}
                            getOptionLabel={(option) =>
                                `${option.dni} - ${option.nombres} ${option.apellidos}`
                            }
                            value={selectedEmpleado}
                            inputValue={dniInputValue}
                            onInputChange={(event, newInputValue) => setDniInputValue(newInputValue)}
                            onChange={(event, value) => {
                                setSelectedEmpleado(value || null);
                                if (value) {
                                    formik.setFieldValue('idEmpleado', value.id);
                                    formik.setFieldValue('nombre', value.nombres);
                                    formik.setFieldValue('apellido', value.apellidos);
                                } else {
                                    formik.setFieldValue('idEmpleado', '');
                                    formik.setFieldValue('nombre', '');
                                    formik.setFieldValue('apellido', '');
                                }
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="DNI"
                                    variant="outlined"
                                    size="small"
                                    error={formik.touched.idEmpleado && Boolean(formik.errors.idEmpleado)}
                                    helperText={formik.touched.idEmpleado && formik.errors.idEmpleado}
                                    fullWidth
                                />
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <TextField
                            value={formik.values.nombre}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            label="Nombre"
                            name="nombre"
                            variant="outlined"
                            size="small"
                            fullWidth
                            disabled
                        />
                        <TextField
                            value={formik.values.apellido}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            label="Apellido"
                            name="apellido"
                            variant="outlined"
                            size="small"
                            fullWidth
                            disabled
                        />
                    </div>
                    <div>
                        <input
                            type="file"
                            accept=".pdf"
                            name='file'
                            ref={(input) => (fileInputRef.current = input)}
                            onChange={(e) => {
                                handleFileChange(e);
                                formik.setFieldValue('file', e.target.files[0]);
                            }}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.file && formik.errors.file && <p className="text-red-500 text-sm">{formik.errors.file}</p>}
                    </div>
                    <div className="flex justify-center">
                        <DateRange
                            editableDateInputs={true}
                            onChange={(item) => setDateRange(item.selection)}
                            moveRangeOnFirstSelection={false}
                            ranges={[dateRange]}
                        />
                    </div>
                    <TextField
                        value={formik.values.descripcion}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        label="Descripción"
                        variant="outlined"
                        fullWidth
                        size="small"
                        name="descripcion"
                        error={formik.touched.descripcion && Boolean(formik.errors.descripcion)}
                        helperText={formik.touched.descripcion && formik.errors.descripcion}
                    />
                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outlined"
                            color="inherit"
                            onClick={handleClose}
                            size="small"
                        >
                            Cerrar
                        </Button>
                        <Button type="submit" variant="contained" color="success" size="small">
                            Agregar
                        </Button>
                    </div>
                </form>
            </CustomModal>
        </>
    );
};

export default AddJustificacion;
