import React, { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch';
import { useSelector } from 'react-redux';
import ErrImg from "../../assets/logos/notFoundImage.webp"
import axios from 'axios';
import { Skeleton } from '@mui/material';

const ImageComponent = ({ path, alt, ...props }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    getImage();
  }, []);

  const getImage = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_ENDPOINT}/${path}`,
        {
          headers: {
            Authorization: `Bearer___${token}`,
          },
          responseType: 'blob',
        }
      );
      
      if (!response.data) {
        throw new Error('La imagen no se pudo obtener.');
      }

      const imageURL = URL.createObjectURL(response.data);
      setImageSrc(imageURL);
    } catch (error) {
      console.error('Error al obtener la imagen:', error);
      setImageSrc(ErrImg);
    }
  };


  return (
    imageSrc ? <img src={imageSrc} alt={alt} {...props} /> :  <Skeleton variant="rectangular"  animation="wave" {...props}/>
  );
};

export default ImageComponent;
