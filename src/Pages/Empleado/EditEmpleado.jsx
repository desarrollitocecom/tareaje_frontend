import React, { useEffect, useState } from 'react';
import CustomModal from '../../Components/Modal/CustomModal';
import SecurityIcon from '@mui/icons-material/Security';
import { Button, TextField, MenuItem, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import CustomSwal, { swalError } from '../../helpers/swalConfig';
import useFetch from '../../Components/hooks/useFetch';
import useFetchData from '../../Components/hooks/useFetchData';
import { calculateAge, handleFileChange } from '../../helpers/fileAndDateUtils';
import ImageComponent from '../../Components/Image/ImageComponent';

const EditEmpleado = ({ Selected, setSelected, refreshData }) => {
    const [Open, setOpen] = useState(false);
    const [foto, setFoto] = useState(null);

    const [dataSets, setDataSets] = useState({
        cargos: [],
        turnos: [],
        regimenLaborales: [],
        sexos: [],
        jurisdicciones: [],
        gradoEstudios: [],
        subgerencias: [],
        lugarTrabajo: [],
        funciones: [],
    });
    const [isLoading, setIsLoading] = useState(false);

    const { token } = useSelector((state) => state.auth);
    const { patchData } = useFetch();
    const {
        fetchSubgerencias, fetchCargos, fetchTurnos, fetchRegimenLaboral,
        fetchSexos, fetchJurisdicciones, fetchGradoEstudio,
        fetchLugarTrabajo, fetchFunciones,
    } = useFetchData(token);

    const formik = useFormik({
        initialValues: {
            nombres: '',
            apellidos: '',
            dni: '',
            ruc: '',
            hijos: '',
            edad: '',
            f_nacimiento: '',
            correo: '',
            domicilio: '',
            celular: '',
            f_inicio: '',
            observaciones: '',
            id_cargo: '',
            id_turno: '',
            id_regimen_laboral: '',
            id_sexo: '',
            id_jurisdiccion: '',
            id_grado_estudios: '',
            id_subgerencia: '',
            id_lugar_trabajo: '',
            id_funcion: '',
        },
        validate: (values) => {
            const errors = {};

            // Validación de nombres
            if (!values.nombres) {
                errors.nombres = 'Campo requerido';
            } else if (!/^[A-Za-zÑñÁÉÍÓÚáéíóú\s]+$/.test(values.nombres)) {
                errors.nombres = 'Debe contener solo letras y espacios';
            }

            // Validación de apellidos
            if (!values.apellidos) {
                errors.apellidos = 'Campo requerido';
            } else if (!/^[A-Za-zÑñÁÉÍÓÚáéíóú\s]+$/.test(values.apellidos)) {
                errors.apellidos = 'Debe contener solo letras y espacios';
            }

            // Validación de DNI
            if (!values.dni) {
                errors.dni = 'Campo requerido';
            } else if (!/^\d{8}$/.test(values.dni)) {
                errors.dni = 'Debe ser un número de 8 dígitos';
            }

            // Validación de RUC
            if (values.ruc && !/^\d{11}$/.test(values.ruc)) {
                errors.ruc = 'Debe ser un número de 11 dígitos';
            }

            // Validación de hijos
            if (values.hijos && (isNaN(values.hijos) || values.hijos < 0)) {
                errors.hijos = 'Debe ser un número positivo';
            }

            // Validación de edad
            if (!values.edad) {
                errors.edad = 'Campo requerido';
            } else if (isNaN(values.edad) || values.edad < 18 || values.edad > 100) {
                errors.edad = 'Debe ser un número entre 18 y 100';
            }

            // Validación de fecha de nacimiento
            if (!values.f_nacimiento) {
                errors.f_nacimiento = 'Campo requerido';
            } else if (isNaN(Date.parse(values.f_nacimiento))) {
                errors.f_nacimiento = 'Debe ser una fecha válida';
            }

            // Validación de correo
            if (!values.correo) {
                errors.correo = 'Campo requerido';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.correo)) {
                errors.correo = 'Debe ser un correo electrónico válido';
            }

            // Validación de domicilio
            if (!values.domicilio) {
                errors.domicilio = 'Campo requerido';
            } else if (values.domicilio.length < 5) {
                errors.domicilio = 'Debe contener al menos 5 caracteres';
            }

            // Validación de celular
            if (!values.celular) {
                errors.celular = 'Campo requerido';
            } else if (!/^\d{9}$/.test(values.celular)) {
                errors.celular = 'Debe ser un número de 9 dígitos';
            }

            // Validación de fecha de inicio
            if (!values.f_inicio) {
                errors.f_inicio = 'Campo requerido';
            } else if (isNaN(Date.parse(values.f_inicio))) {
                errors.f_inicio = 'Debe ser una fecha válida';
            }

            // Validación de observaciones
            if (values.observaciones && values.observaciones.length > 500) {
                errors.observaciones = 'No puede exceder los 500 caracteres';
            }

            [
                { field: 'id_cargo', label: 'Cargo', options: dataSets.cargos },
                { field: 'id_turno', label: 'Turno', options: dataSets.turnos },
                { field: 'id_regimen_laboral', label: 'Régimen Laboral', options: dataSets.regimenLaborales },
                { field: 'id_sexo', label: 'Sexo', options: dataSets.sexos },
                { field: 'id_jurisdiccion', label: 'Jurisdicción', options: dataSets.jurisdicciones },
                { field: 'id_grado_estudios', label: 'Grado de Estudios', options: dataSets.gradoEstudios },
                { field: 'id_subgerencia', label: 'Subgerencia', options: dataSets.subgerencias },
                { field: 'id_lugar_trabajo', label: 'Lugar de Trabajo', options: dataSets.lugarTrabajo },
                { field: 'id_funcion', label: 'Función', options: dataSets.funciones },
            ].forEach(({ field, label, options }) => {
                if (!values[field]) {
                    errors[field] = `${label} es requerido`;
                } else if (!options.some((option) => option.nombre === values[field])) {
                    errors[field] = `${label} no es válido`;
                }
            });



            return errors;
        },

        onSubmit: (values) => {
            const formData = new FormData();
            setIsLoading(true); // Activa el estado de carga durante el envío

            // Convertir nombres a IDs
            const mappedValues = {
                ...values,
                id_cargo: dataSets.cargos.find((option) => option.nombre === values.id_cargo)?.id || '',
                id_turno: dataSets.turnos.find((option) => option.nombre === values.id_turno)?.id || '',
                id_regimen_laboral: dataSets.regimenLaborales.find((option) => option.nombre === values.id_regimen_laboral)?.id || '',
                id_sexo: dataSets.sexos.find((option) => option.nombre === values.id_sexo)?.id || '',
                id_jurisdiccion: dataSets.jurisdicciones.find((option) => option.nombre === values.id_jurisdiccion)?.id || '',
                id_grado_estudios: dataSets.gradoEstudios.find((option) => option.nombre === values.id_grado_estudios)?.id || '',
                id_subgerencia: dataSets.subgerencias.find((option) => option.nombre === values.id_subgerencia)?.id || '',
                id_lugar_trabajo: dataSets.lugarTrabajo.find((option) => option.nombre === values.id_lugar_trabajo)?.id || '',
                id_funcion: dataSets.funciones.find((option) => option.nombre === values.id_funcion)?.id || '',
            };

            Object.entries(mappedValues).forEach(([key, value]) => {
                formData.append(key, value);
            });

            // Manejar la imagen (nueva o existente)
            if (foto && typeof foto !== 'string') {
                formData.append('photo', foto); // Si hay una nueva imagen, adjúntala directamente
            } else if (typeof foto === 'string') {
                // Si la imagen es existente, conviértela a un archivo (blob)
                fetch(`${import.meta.env.VITE_APP_ENDPOINT}/${foto}`, {
                    headers: {
                        Authorization: `Bearer___${token}`,
                    },
                })
                    .then((response) => response.blob()) // Obtén la imagen como Blob
                    .then((blob) => {
                        const fileName = foto.split('/').pop(); // Extrae el nombre de la imagen
                        const existingFile = new File([blob], fileName, { type: blob.type });
                        formData.append('photo', existingFile); // Adjunta la imagen convertida como archivo

                        // Llama al backend con el FormData que incluye la imagen
                        return patchData(`${import.meta.env.VITE_APP_ENDPOINT}/empleados/${Selected.id}`, formData, token);
                    })
                    .then((response) => {
                        if (response?.status) {
                            CustomSwal.fire('Éxito', 'Empleado actualizado correctamente', 'success');
                            refreshData();
                            handleClose();
                        } else {
                            swalError(response.error.response.data);
                        }
                    })
                    .catch((err) => {
                        console.error('Error al convertir la imagen existente en archivo:', err);
                        swalError({
                            message: 'No se pudo procesar la imagen existente',
                            data: [err.message],
                        });
                    })
                    .finally(() => {
                        setIsLoading(false)
                        formik.setSubmitting(false)
                    }
                );
            }

            // Si no hay que convertir una imagen existente, continúa con la llamada al backend
            patchData(`${import.meta.env.VITE_APP_ENDPOINT}/empleados/${Selected.id}`, formData, token)
                .then((response) => {
                    if (response?.status) {
                        CustomSwal.fire('Éxito', 'Empleado actualizado correctamente', 'success');
                        refreshData();
                        handleClose();
                    } else {
                        swalError(response.error.response.data);
                    }
                })
                .catch((error) => {
                    console.error('Error en la solicitud:', error);
                    swalError({
                        message: 'Error inesperado al modificar el empleado',
                        data: [error.message],
                    });
                })
                .finally(() => {
                    setIsLoading(false)
                    formik.setSubmitting(false);
                });
        },

    });

    useEffect(() => {
        setOpen(Selected !== null);
        if (Selected) {
            setIsLoading(true); // Comienza cargando
            Promise.all([
                fetchCargos(),
                fetchTurnos(),
                fetchRegimenLaboral(),
                fetchSexos(),
                fetchJurisdicciones(),
                fetchGradoEstudio(),
                fetchSubgerencias(),
                fetchLugarTrabajo(),
                fetchFunciones(),
            ])
                .then(([cargosRes, turnosRes, regimenLaboralesRes, sexosRes, jurisdiccionesRes, gradoEstudiosRes, subgerenciasRes, lugarTrabajoRes, funcionesRes]) => {
                    const fetchedDataSets = {
                        cargos: cargosRes.data || [],
                        turnos: turnosRes.data || [],
                        regimenLaborales: regimenLaboralesRes.data || [],
                        sexos: sexosRes.data || [],
                        jurisdicciones: jurisdiccionesRes.data || [],
                        gradoEstudios: gradoEstudiosRes.data || [],
                        subgerencias: subgerenciasRes.data || [],
                        lugarTrabajo: lugarTrabajoRes.data || [],
                        funciones: funcionesRes.data || [],
                    };

                    setDataSets(fetchedDataSets);                    

                    formik.setValues({
                        nombres: Selected.nombres || '',
                        apellidos: Selected.apellidos || '',
                        dni: Selected.dni || '',
                        ruc: Selected.ruc || '',
                        hijos: Number.isNaN(parseInt(Selected.hijos)) ? '' : Selected.hijos,
                        edad: Selected.edad || '',
                        f_nacimiento: Selected.f_nacimiento || '',
                        correo: Selected.correo || '',
                        domicilio: Selected.domicilio || '',
                        celular: Selected.celular || '',
                        f_inicio: Selected.f_inicio || '',
                        observaciones: Selected.observaciones || '',
                        id_cargo: fetchedDataSets.cargos.find(opt => opt.nombre === Selected.cargo?.nombre)?.nombre || '',
                        id_turno: fetchedDataSets.turnos.find(opt => opt.nombre === Selected.turno?.nombre)?.nombre || '',
                        id_regimen_laboral: fetchedDataSets.regimenLaborales.find(opt => opt.nombre === Selected.regimenLaboral?.nombre)?.nombre || '',
                        id_sexo: fetchedDataSets.sexos.find(opt => opt.nombre === Selected.sexo?.nombre)?.nombre || '',
                        id_jurisdiccion: fetchedDataSets.jurisdicciones.find(opt => opt.nombre === Selected.jurisdiccion?.nombre)?.nombre || '',
                        id_grado_estudios: fetchedDataSets.gradoEstudios.find(opt => opt.nombre === Selected.gradoEstudios?.nombre)?.nombre || '',
                        id_subgerencia: fetchedDataSets.subgerencias.find(opt => opt.nombre === Selected.subgerencia?.nombre)?.nombre || '',
                        id_lugar_trabajo: fetchedDataSets.lugarTrabajo.find(opt => opt.nombre === Selected.lugarTrabajo?.nombre)?.nombre || '',
                        id_funcion: fetchedDataSets.funciones.find(opt => opt.nombre === Selected.funcion?.nombre)?.nombre || '',
                    });

                    if (Selected?.foto) {
                        setFoto(Selected.foto); // Asegúrate de que `foto` esté disponible en `Selected`
                    }
                })
                .catch((err) => {
                    CustomSwal.fire('Error', 'Error al cargar los datos', 'error');
                    console.error(err);
                })
                .finally(() => setIsLoading(false)); // Asegura que el estado de carga se actualice
        }
    }, [Selected]);

    useEffect(() => {
        if (formik.values.f_nacimiento) {
            const age = calculateAge(formik.values.f_nacimiento);
            formik.setFieldValue('edad', age);
        }
    }, [formik.values.f_nacimiento]);


    const handleFileInputChange = (e) => {
        handleFileChange(e, setFoto, CustomSwal);
    };



    const handleClose = () => {
        setSelected(null);
        setFoto(null);
        formik.resetForm();
    };



    return (
        <CustomModal Open={Open} setOpen={setOpen} handleClose={handleClose} isLoading={isLoading || formik.isSubmitting}>
            <div className="flex items-center mb-2">
                <SecurityIcon className="w-6 h-6 mr-2" />
                <h1 className="text-lg font-bold">Editar Empleado</h1>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-4">
                <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3">
                    {[
                        { name: 'nombres', label: 'Nombres', type: 'text' },
                        { name: 'apellidos', label: 'Apellidos', type: 'text' },
                        { name: 'dni', label: 'DNI', type: 'text' },
                        { name: 'ruc', label: 'RUC', type: 'text' },
                        { name: 'hijos', label: 'Hijos', type: 'number' },
                        { name: 'f_nacimiento', label: 'Fecha de Nacimiento', type: 'date' },
                        { name: 'edad', label: 'Edad', type: 'number', readOnly: true },
                        { name: 'correo', label: 'Correo', type: 'email' },
                        { name: 'domicilio', label: 'Domicilio', type: 'text' },
                        { name: 'celular', label: 'Celular', type: 'text' },
                        { name: 'f_inicio', label: 'Fecha de Inicio', type: 'date' },
                        { name: 'observaciones', label: 'Observaciones', multiline: true, rows: 3 },
                    ].map(({ name, label, type, multiline, rows, readOnly }) => (
                        <TextField
                            key={name}
                            label={label}
                            name={name}
                            type={type}
                            size="small"
                            multiline={multiline}
                            rows={rows}
                            fullWidth
                            value={formik.values[name]}
                            onChange={formik.handleChange}
                            error={formik.touched[name] && Boolean(formik.errors[name])}
                            helperText={formik.touched[name] && formik.errors[name]}
                            slotProps={{
                                input: { readOnly },
                                inputLabel: type === 'date' ? { shrink: true } : undefined,
                            }}
                        />
                    ))}

                    {[
                        { name: 'id_cargo', label: 'Cargo', options: dataSets.cargos },
                        { name: 'id_turno', label: 'Turno', options: dataSets.turnos },
                        { name: 'id_regimen_laboral', label: 'Régimen Laboral', options: dataSets.regimenLaborales },
                        { name: 'id_sexo', label: 'Sexo', options: dataSets.sexos },
                        { name: 'id_jurisdiccion', label: 'Jurisdicción', options: dataSets.jurisdicciones },
                        { name: 'id_grado_estudios', label: 'Grado de Estudios', options: dataSets.gradoEstudios },
                        { name: 'id_subgerencia', label: 'Subgerencia', options: dataSets.subgerencias },
                        { name: 'id_lugar_trabajo', label: 'Lugar de Trabajo', options: dataSets.lugarTrabajo },
                        { name: 'id_funcion', label: 'Función', options: dataSets.funciones },
                    ].map(({ name, label, options }) => (
                        <TextField
                            key={name}
                            select
                            size="small"
                            label={label}
                            name={name}
                            fullWidth
                            value={formik.values[name] || ''}
                            onChange={formik.handleChange}
                            error={formik.touched[name] && Boolean(formik.errors[name])}
                            helperText={formik.touched[name] && formik.errors[name]}
                        >
                            <MenuItem value="" disabled>selecciona una opcion</MenuItem>
                            {options.map((option) => (
                                <MenuItem key={option.id} value={option.nombre}>
                                    {option.nombre}
                                </MenuItem>
                            ))}
                        </TextField>
                    ))}
                    {foto && (
                        <div className="mb-4">
                            <Typography variant="body2" gutterBottom>
                                Vista previa de la foto:
                            </Typography>
                            {typeof foto === 'string' ? (
                                <ImageComponent
                                    path={foto} // La imagen existente se obtiene del servidor
                                    alt="Foto del empleado"
                                    className="w-32 h-32 object-cover rounded"
                                />
                            ) : (
                                <img
                                    src={URL.createObjectURL(foto)} // La nueva imagen seleccionada se previsualiza localmente
                                    alt="Foto del empleado"
                                    className="w-32 h-32 object-cover rounded"
                                />
                            )}
                        </div>
                    )}

                    {/* Campo para cargar nueva foto */}
                    <TextField
                        label="Cambiar Foto"
                        name="foto"
                        type="file"
                        size="small"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        onChange={(e) => handleFileInputChange(e)} // Actualiza solo si se selecciona un nuevo archivo
                        slotProps={{
                            htmlInput: { accept: 'image/jpeg, image/png' }, // Restringe los tipos de archivo permitidos
                        }}
                    />
                    <div className="flex justify-between pt-5">
                        <Button type="button" size="small" variant="contained" color="inherit" onClick={handleClose}>
                            Cerrar
                        </Button>
                        <Button type="submit" size="small" variant="contained" color="success" disabled={formik.isSubmitting}>
                            Actualizar
                        </Button>
                    </div>
                </form>
            </div>
        </CustomModal>
    );
};

export default EditEmpleado;
