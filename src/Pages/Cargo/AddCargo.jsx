import React, { useState } from 'react'
import CustomModal from '../../Components/Modal/CustomModal'
import AddIcon from '@mui/icons-material/Add';
import { Button, Fab, IconButton, Tooltip } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';

const AddCargo = () => {
    const [Open, setOpen] = useState(false)

    const handleClose = () => {
        setOpen(false);
    }

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
                    <h1 className='text-lg font-bold fl'>Añadir un Cargo</h1>
                </div>
                <form>
                    <div>
                        {/* Inputs para el cargo */}
                        
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

export default AddCargo