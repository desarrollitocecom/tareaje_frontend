import React, { useEffect, useRef, useState } from 'react'
import CustomModal from '../../Components/Modal/CustomModal';
import useFetch from '../../Components/hooks/useFetch';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import styled from '@emotion/styled';
import CustomSwal, { swalError } from '../../helpers/swalConfig';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { TIPO_JUSTIFICACIONES } from '../../helpers/Constants';

const UpdateAsistencia = ({ SelectedAsistencia, setRefreshData }) => {
    const [Open, setOpen] = useState(false)
    const { postData } = useFetch()
    const { token } = useSelector((state) => state.auth);
    const fileInputRef = useRef()

    useEffect(() => {
        if (SelectedAsistencia) {
            setOpen(true);
            formik.setFieldValue('fecha', SelectedAsistencia.fecha);
            formik.setFieldValue('id_empleado', SelectedAsistencia.id_empleado);
            formik.setFieldValue('id_asistencia', SelectedAsistencia.id_asistencia);
        }
    }, [SelectedAsistencia])

    const handleClose = () => {
        setOpen(false);
        fileInputRef.current.value = "";
        formik.resetForm();
    }

    const formik = useFormik({
        initialValues: {
            id_empleado: '',
            id_asistencia: '',
            descripcion: '',
            tipo: '',
            fecha: null,
            documents: null,
        },
        validate: (values) => {
            const errors = {};
            if (!values.id_empleado) {
                errors.id_empleado = 'Este campo es obligatorio';
            }
            if (!values.id_asistencia) {
                errors.id_asistencia = 'Este campo es obligatorio';
            }
            if (!values.descripcion) {
                errors.descripcion = 'Este campo es obligatorio';
            }
            if (!values.documents) {
                errors.documents = 'Este campo es obligatorio';
            }
            return errors;
        },
        onSubmit: (values) => {
            formik.setSubmitting(true);

            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    formData.append(key, value);
                }
            });

            postData(`${import.meta.env.VITE_APP_ENDPOINT}/justificaciones/`, formData, token).then((response) => {
                if (response.status) {
                    CustomSwal.fire('Actualizado', 'La justificacion ha sido actualizada correctamente.', 'success');
                    setRefreshData((prev) => !prev);
                    handleClose();
                } else {
                    swalError(response.error.response.data);

                }
            }).catch((error) => {
                swalError("Error inesperado al actualizar la justificacion");
            })
                .finally(() => {
                    formik.setSubmitting(false);
                });

        }
    });

    return (
        <CustomModal Open={Open} handleClose={handleClose} isLoading={formik.isSubmitting}>
            <div className="flex items-center mb-2">
                <h1 className='text-lg font-bold fl'>Actualizar Asistencia</h1>
            </div>
            <form onSubmit={formik.handleSubmit}>
                <div className="grid grid-cols-1 gap-4 text-sm">
                    <div className="flex flex-col gap-1">
                        <label>
                            <span>Justificacion:</span>
                        </label>
                        <div className='flex gap-2 items-center'>
                            <Button
                                component="label"
                                role={undefined}
                                variant="contained"
                                tabIndex={-1}
                                startIcon={<CloudUploadIcon />}
                                size='small'
                                className='!capitalize max-w-max'
                            >
                                Upload files
                                <VisuallyHiddenInput
                                    type="file"
                                    accept="application/pdf" // Solo acepta PDF
                                    ref={(input) => (fileInputRef.current = input)}
                                    onChange={(event) => {
                                        const file = event.target.files?.[0]; // Manejo seguro para evitar errores si no hay archivo seleccionado.

                                        if (!file) {
                                            return; // Salimos si no hay archivo seleccionado.
                                        }

                                        const allowedTypes = ['application/pdf'];
                                        if (!allowedTypes.includes(file.type)) {
                                            CustomSwal.fire('Error', 'Solo se permiten archivos en formato PDF.', 'error');
                                            return;
                                        }

                                        formik.setFieldValue('documents', file);
                                    }}
                                />
                            </Button>
                            <div className={`flex items-center gap-1 ${formik.touched.documents && Boolean(formik.errors.documents) ? 'text-red-500' : ''}`}>
                                <span className='text-xs'>{formik.values.documents ? formik.values.documents.name : 'Seleccione un archivo.'}</span>
                                {formik.values.documents &&
                                    <CloseRoundedIcon
                                        className='!size-4 cursor-pointer'
                                        onClick={() => {
                                            formik.setFieldValue('documents', null)
                                            fileInputRef.current.value = "";
                                        }}
                                    />
                                }
                            </div>
                        </div>

                    </div>


                    <div>
                        <label className="text-sm font-semibold text-gray-600" htmlFor="sexo-label">Tipo</label>
                        <FormControl
                            fullWidth
                            variant="outlined"
                            size="small"
                            className="bg-white"
                            error={formik.touched.tipo && Boolean(formik.errors.tipo)}
                        >
                            <Select
                                labelId={`tipo-label`}
                                name="tipo"
                                value={formik.values.tipo}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                displayEmpty={true}
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            marginTop: 3,
                                            maxHeight: 300,
                                        },
                                    },
                                }}
                                sx={{ fontSize: '0.9rem' }}
                            >
                                <MenuItem defaultChecked value="" sx={{ fontSize: '0.9rem' }}>
                                    <em>'Seleccione una opción</em>
                                </MenuItem>
                                {TIPO_JUSTIFICACIONES.map((option) => (
                                    <MenuItem
                                        key={option}
                                        value={option}
                                    // sx={option}
                                    >
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                            {formik.touched.tipo && formik.errors.tipo && <FormHelperText error>{formik.errors.tipo}</FormHelperText>}
                        </FormControl>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label>
                            <span>Descripción:</span>
                        </label>
                        <TextField
                            size='small'
                            name="descripcion"
                            value={formik.values.descripcion}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.descripcion && Boolean(formik.errors.descripcion)}
                            helperText={formik.touched.descripcion && formik.errors.descripcion || "Ingrese una descripción"}
                            multiline
                            rows={2}
                        />
                    </div>
                </div>
                <div className="flex justify-between pt-5">
                    <Button
                        type="button"
                        size="small"
                        variant="contained"
                        color="inherit"
                        onClick={handleClose}
                    >
                        Cerrar
                    </Button>
                    <Button
                        type="submit"
                        size="small"
                        variant="contained"
                        color="success"
                        disabled={formik.isSubmitting}
                    >
                        Enviar
                    </Button>
                </div>
            </form>
        </CustomModal>
    )
}

export default UpdateAsistencia


const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});