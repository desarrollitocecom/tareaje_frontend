import React, { useState, useEffect } from 'react';
import CustomModal from '../../Components/Modal/CustomModal';
import AddIcon from '@mui/icons-material/Add';
import { Button, IconButton, Tooltip, TextField, Autocomplete } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import { useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import CustomSwal, { swalError } from '../../helpers/swalConfig';
import useFetch from '../../Components/hooks/useFetch';
import useFetchData from '../../Components/hooks/useFetchData';
import { PDFDocument } from 'pdf-lib';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const AddJustificacion = ({ refreshData }) => {
    const [Open, setOpen] = useState(false);
    const { token } = useSelector((state) => state.auth);
    const [file, setFile] = useState(null);
    const { postData } = useFetch();
    const { fetchEmpleados } = useFetchData(token);
    const [empleados, setEmpleados] = useState([]);
    const [dniInputValue, setDniInputValue] = useState('');
    const [selectedEmpleado, setSelectedEmpleado] = useState(null);
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
        setSelectedEmpleado(null);
        setDateRange({
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        });
    };

    const validate = (values) => {
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
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleConvertAndSubmit = async (values, { resetForm }) => {
        if (!file) {
            swalError('Debe adjuntar un archivo válido.');
            return;
        }

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await PDFDocument.load(arrayBuffer);
            const mergedPdf = await PDFDocument.create();
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));

            const pdfBytes = await mergedPdf.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const fileConvert = new File([blob], file.name || 'merged.pdf', { type: 'application/pdf' });

            const formData = new FormData();
            formData.append('documents', fileConvert);
            formData.append('id_empleado', values.idEmpleado);
            formData.append('f_inicio', dateRange.startDate.toISOString());
            formData.append('f_fin', dateRange.endDate.toISOString());
            formData.append('id_asistencia', values.idasistencia);
            formData.append('descripcion', values.descripcion);

            const response = await postData(`${import.meta.env.VITE_APP_ENDPOINT}/justificaciones`, formData, token);

            if (response.status) {
                CustomSwal.fire('Agregado', 'La justificación se ha registrado correctamente.', 'success');
                refreshData();
                resetForm();
                handleClose();
            } else {
                throw new Error(response.error || 'Error desconocido al registrar la justificación');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Error desconocido';
            swalError(errorMessage);
            console.error(err);
        }
    };

    return (
        <>
            <Tooltip title="Añadir" placement="top" arrow>
                <IconButton aria-label="add" onClick={() => setOpen(true)}>
                    <AddIcon />
                </IconButton>
            </Tooltip>
            <CustomModal Open={Open} setOpen={setOpen} handleClose={handleClose}>
                <div className="flex items-center mb-2">
                    <SecurityIcon className="w-6 h-6 mr-2" />
                    <h1 className="text-lg font-bold">Añadir una Justificación</h1>
                </div>
                <Formik
                    initialValues={{ idEmpleado: '', descripcion: '', nombre: '', apellido: '', idasistencia: '' }}
                    validate={validate}
                    onSubmit={handleConvertAndSubmit}
                >
                    {({ errors, touched, setFieldValue }) => (
                        <Form className="space-y-4">
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
                                            setFieldValue('idEmpleado', value.id);
                                            setFieldValue('nombre', value.nombres);
                                            setFieldValue('apellido', value.apellidos);
                                        } else {
                                            setFieldValue('idEmpleado', '');
                                            setFieldValue('nombre', '');
                                            setFieldValue('apellido', '');
                                        }
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="DNI"
                                            variant="outlined"
                                            size="small"
                                            error={touched.idEmpleado && Boolean(errors.idEmpleado)}
                                            helperText={touched.idEmpleado && errors.idEmpleado}
                                            fullWidth
                                        />
                                    )}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Field
                                    as={TextField}
                                    label="Nombre"
                                    name="nombre"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    disabled
                                />
                                <Field
                                    as={TextField}
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
                                    onChange={(e) => {
                                        handleFileChange(e);
                                        setFieldValue('file', e.target.files[0]);
                                    }}
                                />
                                {errors.file && <p className="text-red-500 text-sm">{errors.file}</p>}
                            </div>
                            <div className="flex justify-center">
                                <DateRange
                                    editableDateInputs={true}
                                    onChange={(item) => setDateRange(item.selection)}
                                    moveRangeOnFirstSelection={false}
                                    ranges={[dateRange]}
                                />
                            </div>
                            <Field
                                as={TextField}
                                label="Idasistencia"
                                variant="outlined"
                                fullWidth
                                size="small"
                                name="idasistencia"
                                error={touched.idasistencia && Boolean(errors.idasistencia)}
                                helperText={touched.idasistencia && errors.idasistencia}
                            />
                            <Field
                                as={TextField}
                                label="Descripción"
                                variant="outlined"
                                fullWidth
                                size="small"
                                name="descripcion"
                                error={touched.descripcion && Boolean(errors.descripcion)}
                                helperText={touched.descripcion && errors.descripcion}
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
                        </Form>
                    )}
                </Formik>
            </CustomModal>
        </>
    );
};

export default AddJustificacion;
