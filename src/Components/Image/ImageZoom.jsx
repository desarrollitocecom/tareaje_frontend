import React from 'react';
import { Dialog } from '@mui/material';
import ImageComponent from './ImageComponent';

const ImageZoom = ({ open, onClose, imageSrc, altText }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <div className="flex justify-center items-center p-4">
        <ImageComponent
          path={imageSrc} // Ruta de la imagen
          alt={altText} // Texto alternativo
          className="max-w-full max-h-[500px] object-contain" // Ajusta la imagen al diálogo
        />
      </div>
    </Dialog>
  );
};

export default ImageZoom;
