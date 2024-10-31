import React from 'react';
import { Modal, Skeleton, Zoom } from '@mui/material';
import ReactCompareImage from "react-compare-image";

function ImageComparisonModal({ open, handleClose, imagen, captura }) {
    return (
        <Modal
            keepMounted
            open={open}
            onClose={handleClose}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Zoom in={open}>
                <div className="w-[95%] max-w-xl min-h-[300px] rounded-lg overflow-hidden relative">
                    {/* Comparador de imágenes con skeleton integrado */}
                    <ReactCompareImage
                        leftImage={imagen}
                        rightImage={captura}
                        skeleton={
                            <Skeleton
                                animation="wave"
                                variant="rectangular"
                                width="100%"
                                height="100%"
                            />
                        }
                    />
                </div>
            </Zoom>
        </Modal>
    );
}

export default ImageComparisonModal;
