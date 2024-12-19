import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ErrImg from "../../assets/logos/notFoundImage.webp"
import { Skeleton } from '@mui/material';
import useFetchData from '../hooks/useFetchData';

const ImageComponent = ({ path, errorImage, alt, ...props }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const { token } = useSelector((state) => state.auth);
  const { fetchImage } = useFetchData(token);

  useEffect(() => {
    if (path && path !== 'Sin foto') {
      getImage(path);
    } else {
      setImageSrc(errorImage || ErrImg);
    }
  }, [path]);

  const getImage = async (path) => {
    const imageURL = await fetchImage(path);

    if (!imageURL) {
      setImageSrc(errorImage || ErrImg);
      return;
    }

    setImageSrc(imageURL);

  };


  return (
    imageSrc ? <img src={imageSrc} alt={alt} {...props} /> : <Skeleton sx={{ height: '100%' }} variant="rectangular" animation="wave" {...props} />
  );
};

export default ImageComponent;
