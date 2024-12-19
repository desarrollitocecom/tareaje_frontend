import { Autocomplete, Button, Checkbox, IconButton, TextField, Tooltip } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import useFetch from '../../Components/hooks/useFetch';
import CustomModal from '../../Components/Modal/CustomModal';
import SecurityIcon from '@mui/icons-material/Security';
import { useFormik } from 'formik';
import { TimePicker } from '@mui/x-date-pickers';
import useFetchData from '../../Components/hooks/useFetchData';
import dayjs from 'dayjs';
import CustomSwal, { swalError } from '../../helpers/swalConfig';

const AddHorario = ({ refreshData }) => {
    const [Open, setOpen] = useState(false)
    const { postData } = useFetch();
    const { token } = useSelector(state => state.auth);
    const { fetchSubgerencias, fetchTurnos, fetchFunciones } = useFetchData(token);
    const [isLoading, setisLoading] = useState(false);
    const [dataSets, setDataSets] = useState({
        turnos: [],
        subgerencias: [],
        funciones: [],
    });

    const handleClose = () => {
        setOpen(false);
        formik.resetForm();
    }

    const formik = useFormik({
        initialValues: {
            area: '',
            inicio: null,
            fin: null,
            id_turno: '',
            id_subgerencia: '',
            ids_funcion: []
        },
        validate: (values) => {
            const errors = {};
            if (!values.area) {
                errors.area = 'Campo requerido';
            } else if (!/^[A-Za-zÑñÁÉÍÓÚáéíóú\s]+$/.test(values.area)) {
                errors.area = 'Debe contener solo letras y espacios';
            }
            if (!values.inicio) {
                errors.inicio = 'Campo requerido';
            } else if (isNaN(Date.parse(values.inicio))) {
                errors.inicio = 'Debe ser una fecha válida';
            }
            if (!values.fin) {
                errors.fin = 'Campo requerido';
            } else if (isNaN(Date.parse(values.fin))) {
                errors.fin = 'Debe ser una fecha válida';
            }
            if (!values.id_turno) {
                errors.id_turno = 'Campo requerido';
            } 
            if (!values.id_subgerencia) {
                errors.id_subgerencia = 'Campo requerido';
            }
            if (values.ids_funcion && values.ids_funcion.length === 0) {
                errors.ids_funcion = 'Debe seleccionar al menos una función';                
            }
            return errors;
        },
        onSubmit: (values) => {            
            const data = {
                nombre: values.area,
                inicio: dayjs(values.inicio).format('HH:mm:ss'),
                fin: dayjs(values.fin).format('HH:mm:ss'),
                id_turno: values.id_turno,
                id_subgerencia: values.id_subgerencia,
                ids_funcion: values.ids_funcion
            }
            postData(`${import.meta.env.VITE_APP_ENDPOINT}/rangohorarios`, data, token)
            .then((response) => {
                if (response.status) {
                    handleClose();
                    CustomSwal.fire(
                        'Agregado',
                        'El horario ha sido agregado correctamente.',
                        'success'
                    );
                    refreshData();
                } else {
                    swalError(response.error.response.data);
                }
            })
            .catch((error) => {
                console.error('Error en la solicitud:', error);
                swalError({
                    message:  'Error inesperado al agregar el horario',
                    data: [error.message],
                });
            })
            .finally(() => {
                formik.setSubmitting(false);
            });
            
        }
    });


    useEffect(() => {
        if (Open) {            
            setisLoading(true);
            Promise.all([
                fetchTurnos(),
                fetchSubgerencias(),
                fetchFunciones(),
            ])
                .then(([turnosRes, subgerenciasRes, funcionesRes]) => {
                    setDataSets({
                        turnos: turnosRes.data || [],
                        subgerencias: subgerenciasRes.data || [],
                        funciones: funcionesRes.data || [],
                    });
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => setisLoading(false));
        }
    }, [Open]);
    
    return (
        <>
            <Tooltip title="Añadir" placement='top' arrow>
                <IconButton aria-label="add" onClick={() => setOpen(true)}>
                    <AddIcon />
                </IconButton>
            </Tooltip>
            <CustomModal Open={Open} setOpen={setOpen} handleClose={handleClose} isLoading={isLoading || formik.isSubmitting}>
                <div className="flex items-center mb-2">
                    <SecurityIcon className="w-6 h-6 mr-2" />
                    <h1 className='text-lg font-bold fl'>Añadir un horario</h1>
                </div>
                <form onSubmit={formik.handleSubmit}>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <div>
                            <TextField
                                fullWidth
                                type='text'
                                label='Area'
                                name='area'
                                className='rounded-lg'
                                size='small'
                                value={formik.values.area}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.area && Boolean(formik.errors.area)}
                                helperText={formik.touched.area && formik.errors.area || 'Ingrese el Area'}
                            />
                        </div>
                        <div></div>
                        <TimePicker
                            slotProps={{
                                textField: {
                                    size: 'small',
                                    error: formik.touched.inicio && Boolean(formik.errors.inicio),
                                    helperText: formik.touched.inicio && formik.errors.inicio || 'Formato: HH:MM',
                                    onBlur: formik.handleBlur,
                                }
                            }}
                            name='inicio'
                            value={formik.values.inicio}
                            onChange={(e) => formik.setFieldValue('inicio', e)}
                            label="Inicio"
                        />
                        <TimePicker
                            slotProps={{
                                textField: {
                                    size: 'small',
                                    error: formik.touched.fin && Boolean(formik.errors.fin),
                                    helperText: formik.touched.fin && formik.errors.fin || 'Formato: HH:MM',
                                    onBlur: formik.handleBlur,
                                }
                            }}
                            name='fin'
                            value={formik.values.fin}
                            onChange={(e) => formik.setFieldValue('fin', e)}
                            label="Fin"
                        />
                        <Autocomplete
                            id='id_turno'
                            value={dataSets.turnos.find(turno => turno.id === formik.values.id_turno)}
                            onChange={(e, value) => formik.setFieldValue('id_turno', value.id)}
                            onBlur={formik.handleBlur}
                            size='small'
                            renderInput={(params) => (
                                <TextField
                                    label="Turno"
                                    name='id_turno'
                                    error={formik.touched.id_turno && Boolean(formik.errors.id_turno)}
                                    helperText={formik.touched.id_turno && formik.errors.id_turno || 'Seleccione un turno'}
                                    {...params}
                                />
                            )}
                            options={dataSets.turnos}
                            getOptionLabel={(option) => option.nombre || ""}
                        />
                        <Autocomplete
                            id='id_subgerencia'
                            value={dataSets.subgerencias.find(subgerencia => subgerencia.id === formik.values.id_subgerencia)}
                            onChange={(e, value) => formik.setFieldValue('id_subgerencia', value.id)}
                            onBlur={formik.handleBlur}
                            size='small'
                            renderInput={(params) => (
                                <TextField
                                    label="Subgerencia"
                                    name='id_subgerencia'
                                    error={formik.touched.id_subgerencia && Boolean(formik.errors.id_subgerencia)}
                                    helperText={formik.touched.id_subgerencia && formik.errors.id_subgerencia || 'Seleccione una subgerencia'}
                                    {...params}
                                />
                            )}
                            options={dataSets.subgerencias}
                            getOptionLabel={(option) => option.nombre || ""}
                        />

                        <Autocomplete
                            multiple
                            className='col-span-2'
                            id='ids_funcion'
                            value={dataSets.funciones.filter(funcion => formik.values.ids_funcion.includes(funcion.id))}
                            onChange={(e, value) => {
                                const ids = value.map(item => item.id);
                                formik.setFieldValue('ids_funcion', ids); 
                            }}
                            onBlur={formik.handleBlur}
                            size='small'
                            renderInput={(params) => (
                                <TextField
                                    label="Funciones"
                                    name='ids_funcion'
                                    error={formik.touched.ids_funcion && Boolean(formik.errors.ids_funcion)}
                                    helperText={formik.touched.ids_funcion && formik.errors.ids_funcion || 'Seleccione las funciones'}
                                    {...params}
                                />
                            )}
                            renderOption={(props, option, { selected }) => {
                                const { key, ...optionProps } = props;
                                return (
                                    <li key={key} {...optionProps} >
                                        <Checkbox
                                            size='small'
                                            style={{ marginRight: 8 }}
                                            checked={selected}
                                        />
                                        {option.nombre}
                                    </li>
                                );
                            }}
                            options={dataSets.funciones}
                            disableCloseOnSelect
                            getOptionLabel={(option) => option.nombre}
                        />
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
    )
}

export default AddHorario