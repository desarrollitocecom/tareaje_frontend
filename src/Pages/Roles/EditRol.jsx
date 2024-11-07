import React, { useEffect, useState } from 'react'
import CustomModal from '../../Components/Modal/CustomModal'
import SecurityIcon from '@mui/icons-material/Security';
import { Button, IconButton, TextField, Tooltip } from '@mui/material';
import { useSelector } from 'react-redux';
import useFetch from '../../Components/hooks/useFetch';
import CustomSwal from '../../helpers/swalConfig';
import TablaPermisos from '../../Components/Table/TablaPermisos';
import useFetchData from '../../Components/hooks/useFetchData';
import { useFormik } from 'formik';

const EditRol = ({ Selected, setSelected, refreshData }) => {
    const [Open, setOpen] = useState(false);
    const { token } = useSelector((state) => state.auth);
    const { fetchPermisos,fetchPermisosRol } = useFetchData(token);
    const { patchData } = useFetch();
    const [permisos, setPermisos] = useState([]);
    const [permisosAgrupados, setPermisosAgrupados] = useState([])
    const [isLoading, setisLoading] = useState(null)

    useEffect(() => {
        setOpen(Selected !== null);
        if (Selected) {  
            setisLoading(true)          
            fetchPermisosRol(Selected.id).then((res) => {
                if (permisos.length === 0) {
                    throw ('Error al obtener los permisos del rol');
                }
                               
                const arrPermisos = res.data.map((permiso) => {
                    const permisoEncontrado = permisos.find(permisoKey => permisoKey.nombre === permiso);
                    if (permisoEncontrado) {
                        return permisoEncontrado.id;
                    }
                });
                
                formik.setFieldValue('nombre', Selected.nombre);
                formik.setFieldValue('descripcion', Selected.descripción);
                formik.setFieldValue('permisos', arrPermisos);                
                
            }).catch((err) => {
                CustomSwal.fire({
                    title: 'Error al obtener los permisos del rol',
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

    useEffect(() => {
        fetchPermisos().then((res) => {
            const permisos = res.data;
            
            const permisosAgrupados = permisos.reduce((acc, permiso) => {
                // Excluir el permiso 'all_system_access'
                if (permiso.nombre === 'all_system_access') return acc;

                const modulo = permiso.nombre.split('_')[1]; // Obtener el módulo (por ejemplo: "asistencia", "cargo", etc.)

                // Si el módulo no existe en el acumulador, lo inicializamos como un array vacío
                if (!acc[modulo]) {
                    acc[modulo] = [];
                }

                // Añadir el permiso al módulo correspondiente
                acc[modulo].push(permiso);

                return acc;
            }, {});

            setPermisos(permisos);
            setPermisosAgrupados(permisosAgrupados);
        });
    }, [])



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
                console.log(res);
                
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
                    CustomSwal.fire({
                        icon: 'error',
                        title: res.error.response.data.message,
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 4000
                    });
                }

            }).catch((err) => {
                CustomSwal.fire({
                    icon: 'error',
                    title: err.response.data.message || 'Error al editar el rol',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 4000
                })
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