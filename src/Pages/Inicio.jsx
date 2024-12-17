import { CircularProgress } from '@mui/material';
import React, { useState } from 'react'

const Inicio = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className='w-full h-full flex items-center justify-center'>
      {
        isLoading && (
          <div className='w-full h-full flex items-center justify-center absolute bg-white/80'>
            <CircularProgress />
          </div>
        )
      }
      <iframe
        width="100%"
        height="100%"
        src="https://lookerstudio.google.com/embed/reporting/c8af45ff-26d4-4efe-b0c8-1b613e5d0870/page/Q85YE"
        frameborder="0"
        sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        onLoad={handleIframeLoad}
      ></iframe>
    </div>
  )
}

export default Inicio