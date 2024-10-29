import React, { useEffect, useState } from 'react'
import CustomModal from '../../Components/Modal/CustomModal'
import SecurityIcon from '@mui/icons-material/Security';
import { Button } from '@mui/material';

const EditJurisdiccion = ({ Selected, setSelected }) => {
    const [Open, setOpen] = useState(false);

    useEffect(() => {        
        setOpen(Selected !== null);
    }, [Selected])
    


    const handleClose = () => {
        setSelected(null);
    }

    // Usar selected para sacar los datos del empleado
    return (
        <CustomModal Open={Open} setOpen={setOpen} handleClose={handleClose}>
            <div className="flex items-center mb-2">
                <SecurityIcon className="w-6 h-6 mr-2" />
                <h1 className='text-lg font-bold fl'>Editar una Jurisdicción</h1>
            </div>
            <form>
                <div>
                    {/* Inputs para la jurisdiccion */}
                    {/* Ejemplo para poner valores {Selected?.nombres} poner el '?' para que no de error */}
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
    )
}

export default EditJurisdiccion