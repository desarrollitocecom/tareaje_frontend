import React, { useState } from 'react'
import CustomModal from '../../Components/Modal/CustomModal'
import AddIcon from '@mui/icons-material/Add';
import { Button, Fab, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TextField, Tooltip } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import { useFormik } from 'formik';

const AddRol = () => {
    const [Open, setOpen] = useState(false)

    const handleClose = () => {
        setOpen(false);
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

            if (permisos.length === 0) {
                errors.permisos = 'Debe seleccionar al menos un permiso';
            }


            return errors;
        },
        onSubmit: (values) => {
            console.log(values);
        }
    })

    return (
        <>
            <Tooltip title="Añadir" placement='top' arrow>
                <IconButton aria-label="add" onClick={() => setOpen(true)}>
                    <AddIcon />
                </IconButton>
            </Tooltip>
            <CustomModal Open={Open} setOpen={setOpen} handleClose={handleClose}>
                <div className="flex items-center mb-2">
                    <SecurityIcon className="w-6 h-6 mr-2" />
                    <h1 className='text-lg font-bold'>Añadir un rol</h1>
                </div>
                <form className='mt-8'>
                    <div className='flex flex-col gap-3'>
                        <div>
                            {/* Inputs para el rol */}
                            <TextField
                                id="nombre"
                                label="Nombre"
                                variant="outlined"
                                size='small'
                                helperText="Ingrese el nombre del rol"
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
                                multiline
                                rows={3}
                            />

                        </div>
                        <div>
                            <h3 className='text-base ml-3 mb-1'>Permisos</h3>
                            <div>
                                <Table size='small' className='text-nowrap'>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className0='text-sm' align="left">
                                                Modulo
                                            </TableCell>
                                            <TableCell className='text-sm !max-w-5' align="center">
                                                Ver
                                            </TableCell>
                                            <TableCell className='text-sm !max-w-5' align="center">
                                                Crear
                                            </TableCell>
                                            <TableCell className='text-sm !max-w-5' align="center">
                                                Actualizar
                                            </TableCell>
                                            <TableCell className='text-sm !max-w-5' align="center">
                                                Eliminar
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className='!border-none !py-3' align="left">
                                                Roles
                                            </TableCell>
                                            <TableCell className='!border-none !py-3' align="center">
                                                <input type="checkbox" />
                                            </TableCell>
                                            <TableCell className='!border-none !py-3' align="center">
                                                <input type="checkbox" />
                                            </TableCell>
                                            <TableCell className='!border-none !py-3' align="center">
                                                <input type="checkbox" />
                                            </TableCell>
                                            <TableCell className='!border-none !py-3' align="center">
                                                <input type="checkbox" />
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-between pt-5'>
                        <div></div>
                        <div className='flex gap-3'>
                            <Button type='button' size='small' variant="contained" color="inherit" onClick={handleClose}>Cerrar</Button>
                            {/* <Button type='submit' size='small' variant="contained" color="success" disabled={formik.isSubmitting}>Agregar</Button> */}
                        </div>
                    </div>
                </form>
            </CustomModal>
        </>
    )
}

export default AddRol