import React, { useState, useEffect } from "react";

const ZoomImage = ({ imagen, captura, closeZoom, initialRect }) => {
  const [zoomStyles, setZoomStyles] = useState({});
  const [isZoomingOut, setIsZoomingOut] = useState(false);

  useEffect(() => {
    
    if (imagen && captura && initialRect && initialRect.top !== undefined && initialRect.left !== undefined) {
      // Configuración inicial desde el punto de clic
      setZoomStyles({
        position: "fixed",
        top: `${initialRect.top}px`,
        left: `${initialRect.left}px`,
        width: "0px",
        height: "0px",
        opacity: 0.8,
        transform: "scale(1)",
        transition: "all 0.5s ease",
        objectFit: "contain",
      });

      // Iniciar el zoom después de asegurar la configuración inicial
      setTimeout(() => {
        setZoomStyles({
          position: "fixed",
          top: "50%",
          left: "50%",
          mimleft: "60%",
          width: "80vw",
          height: "auto",
          maxWidth: "50vw",
          maxHeight: "80vh",
          transform: "translate(-50%, -50%)",
          opacity: 1,
          transition: "all 1s ease",
          objectFit: "contain",
        });
      }, 10);
    }
  }, [imagen, captura, initialRect]);

  const handleBackgroundClick = (event) => {
    if (event.target === event.currentTarget) {
      setIsZoomingOut(true);
      setZoomStyles({
        position: "fixed",
        top: `${initialRect.top}px`,
        left: `${initialRect.left}px`,
        width: "0px",
        height: "0px",
        transform: "scale(1)",
        opacity: 0,
        transition: "all 0.5s ease",
        objectFit: "contain",
      });
      setTimeout(() => {
        closeZoom();
        setIsZoomingOut(false);
      }, 500);
    }
  };

  return (
    <>
      {(imagen || isZoomingOut) && (
        <div
          className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50"
          onClick={handleBackgroundClick}
        >
          <div style={zoomStyles} className="flex gap-4 overflow-x-auto rounded-lg">
            <div className="w-1/2 h-full">
              <img src={imagen} alt="Imagen de usuario" className="w-full h-full object-contain rounded-lg" />
            </div>
            <div className="w-1/2 h-full">
              <img src={captura} alt="Captura de usuario" className="w-full h-full object-contain rounded-lg" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ZoomImage;
