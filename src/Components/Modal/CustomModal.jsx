import { Box, CircularProgress, Fade, Modal } from '@mui/material';
import zIndex from '@mui/material/styles/zIndex';
import React from 'react'

const CustomModal = ({ children, Open, handleClose, className, isLoading }) => {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
    };
    return (
        <Modal
            keepMounted
            open={Open}
            onClose={handleClose}
            aria-labelledby="keep-mounted-modal-title"
            aria-describedby="keep-mounted-modal-description"
        >
            <Fade in={Open} >
                <Box sx={style} className={`w-[95%] max-w-2xl rounded-md text-black ${className}`}>
                    {isLoading ?
                        <div className='absolute rounded-lg w-full h-full flex items-center justify-center bg-white/80 z-10 top-0 left-0'>
                            <CircularProgress size="30px" />
                        </div>
                        : null}
                    {children}
                </Box>
            </Fade>
        </Modal>
    )
}

export default CustomModal