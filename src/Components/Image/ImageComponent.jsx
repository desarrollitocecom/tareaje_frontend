import React, { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch';
import { useSelector } from 'react-redux';
import ErrImg from "../../assets/logos/notFoundImage.webp"
import axios from 'axios';
import { Skeleton } from '@mui/material';
import useFetchData from '../hooks/useFetchData';

const ImageComponent = ({ path, alt, ...props }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const { token } = useSelector((state) => state.auth);
  const { fetchImage } = useFetchData(token);

  useEffect(() => {
    if (path) {
      getImage(path);
    }
  }, [path]);

  const getImage = async (path) => {
    const imageURL = await fetchImage(path);
    
    if (!imageURL) {
      setImageSrc(ErrImg);
      return;
    }

    setImageSrc(imageURL);
    
  };


  return (
    imageSrc ? <img src={imageSrc} alt={alt} {...props} /> : <Skeleton variant="rectangular" animation="wave" {...props} />
  );
};

export default ImageComponent;
