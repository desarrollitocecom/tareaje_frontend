import React, { useEffect, useState } from 'react'
import CustomModal from '../../Components/Modal/CustomModal'
import SecurityIcon from '@mui/icons-material/Security';
import { Button, TextField } from '@mui/material';
import { useSelector } from 'react-redux';
import useFetch from '../../Components/hooks/useFetch';
import CustomSwal, { swalError } from '../../helpers/swalConfig';
import TablaPermisos from '../../Components/Table/TablaPermisos';
import useFetchData from '../../Components/hooks/useFetchData';
import { useFormik } from 'formik';

const EditRol = ({ Selected, setSelected, refreshData, permisos, permisosAgrupados }) => {
    const [Open, setOpen] = useState(false);
    const { token } = useSelector((state) => state.auth);
    const { fetchPermisosRol } = useFetchData(token);
    const { patchData } = useFetch();

    const [isLoading, setisLoading] = useState(null)

    useEffect(() => {
        setOpen(Selected !== null);
        if (Selected) {
            setisLoading(true)
            fetchPermisosRol(Selected.id).then((res) => {
                const data = res.data;
                const permisos = data.permisos.map((permiso) => permiso.id);

                formik.setFieldValue('nombre', data.nombre);
                formik.setFieldValue('descripcion', data.descripcion);
                formik.setFieldValue('permisos', permisos);

            }).catch((err) => {
                CustomSwal.fire({
                    title: 'Error al obtener la información del rol',
                    icon: 'error',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 4000
                })
            }).finally(() => {
                setisLoading(false)
            })

        }
    }, [Selected])



    const handleClose = () => {
        setSelected(null);
        formik.resetForm();
    }

    const formik = useFormik({
        initialValues: {
            nombre: '',
            descripcion: '',
            permisos: []
        },
        validate: (values) => {
            const errors = {};
            if (!values.nombre) {
                errors.nombre = 'Este campo es obligatorio';
            }
            else if (!/^[a-zA-Z0-9\s]+$/.test(values.nombre)) { // Verifica si solo contiene letras, numeros y espacios
                errors.nombre = 'El rol solo debe contener letras';
            }

            if (!values.descripcion) {
                errors.descripcion = 'Este campo es obligatorio';
            } else if (!/^[a-zA-Z0-9\s.,]+$/.test(values.descripcion)) { // Verifica si solo contiene letras, numeros y espacios ¨,.¨
                errors.descripcion = 'La descripción solo debe contener letras';
            }

            if (values.permisos.length === 0) {
                errors.permisos = 'Debe seleccionar al menos un permiso';
            }


            return errors;
        },
        onSubmit: (values) => {

            patchData(`${import.meta.env.VITE_APP_ENDPOINT}/auth/rol/${Selected.id}`, values, token, true).then((res) => {
                if (res.status) {
                    CustomSwal.fire({
                        icon: 'success',
                        title: res.data.message,
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 4000
                    });
                    refreshData();
                    handleClose();
                } else {
                    throw (response.error);
                }

            }).catch((err) => {
                swalError(err.response?.data);
                
                console.error(err);
            }).finally(() => {
                formik.setSubmitting(false);
            })
        }
    })

    // Usar selected para sacar los datos del rol
    return (
        <CustomModal Open={Open} setOpen={setOpen} handleClose={handleClose} isLoading={isLoading || formik.isSubmitting}>
            <div className="flex items-center mb-2">
                <SecurityIcon className="w-6 h-6 mr-2" />
                <h1 className='text-lg font-bold fl'>Editar un rol</h1>
            </div>
            <form onSubmit={formik.handleSubmit} className='mt-8'>
                <div className='flex flex-col gap-3'>
                    <div>
                        {/* Inputs para el rol */}
                        <TextField
                            id="nombre"
                            label="Nombre"
                            variant="outlined"
                            size='small'
                            helperText="Ingrese el nombre del rol"
                            className='w-full md:max-w-64'
                            name='nombre'
                            value={formik.values.nombre}
                            onChange={formik.handleChange}
                            error={formik.touched.nombre && Boolean(formik.errors.nombre)}
                        />
                    </div>
                    <div>
                        {/* Inputs para la descripción */}
                        <TextField
                            fullWidth
                            id="descripcion"
                            label="Descripción"
                            variant="outlined"
                            size="small"
                            helperText="Ingrese una descripción"
                            name='descripcion'
                            value={formik.values.descripcion}
                            onChange={formik.handleChange}
                            error={formik.touched.descripcion && Boolean(formik.errors.descripcion)}
                            multiline
                            rows={3}
                        />

                    </div>
                    <div>
                        <TablaPermisos formik={formik} permisosAgrupados={permisosAgrupados} />
                    </div>
                </div>

                <div className='flex justify-between pt-5'>
                    <div></div>
                    <div className='flex gap-3'>
                        <Button type='button' size='small' variant="contained" color="inherit" onClick={handleClose}>Cerrar</Button>
                        <Button type='submit' size='small' variant="contained" color="success" disabled={formik.isSubmitting}>Editar</Button>
                    </div>
                </div>
            </form>
        </CustomModal>
    )
}

export default EditRol