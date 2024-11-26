import React, { useEffect, useState } from 'react'
import CustomModal from '../Modal/CustomModal'
import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider";
import SwapHorizRoundedIcon from '@mui/icons-material/SwapHorizRounded';
import { useSelector } from 'react-redux';
import useFetchData from '../hooks/useFetchData';
import { Skeleton } from '@mui/material';
import ErrImg from "../../assets/logos/notFoundImage.webp"

const CompareImages = ({ open, handleClose, imagen, captura }) => {
    const { token } = useSelector((state) => state.auth);
    const { fetchImage } = useFetchData(token);
    const [ImageBD, setImageBD] = useState(null)
    const [ImageAxon, setImageAxon] = useState(null)
    const [isLoading, setisLoading] = useState(false)

    useEffect(() => {
        if (open) {
            fetchImagenes()
        }
    }, [open])

    const fetchImagenes = async () => {
        try {
            setisLoading(true)
            // Ejecutar ambas promesas en paralelo
            const [ImageBD, ImageAxon] = await Promise.all([
                fetchImage(imagen),
                fetchImage(captura),
            ]);

            // Actualizar estados con los resultados
            setImageBD(ImageBD);
            setImageAxon(ImageAxon);
        } finally {
            setisLoading(false);
        }

    }

    return (
        <CustomModal Open={open} handleClose={handleClose} className={'max-w-md'}>
            {isLoading ?
                <div className='w-full h-[500px] flex items-center justify-center rounded-lg overflow-hidden'>
                    <Skeleton variant="rectangular" animation="wave" width={'100%'} height={'100%'} />
                </div>
                :
                <div className="w-full max-w-lg mx-auto rounded-lg overflow-hidden">
                    <ReactCompareSlider
                        itemOne={<ReactCompareSliderImage src={ImageBD || ErrImg} alt="Imagen 1" />}
                        itemTwo={<ReactCompareSliderImage src={ImageAxon || ErrImg} alt="Imagen 2" />}
                        style={{
                            width: "100%",
                            height: "500px",
                        }}
                        boundsPadding={23}
                        handle={
                            <div className='flex items-center justify-center'>
                                <div className='shadow-lg h-full border absolute w-[4px] bg-white'></div>
                                <div
                                    className='shadow-lg flex items-center justify-center border border-white bg-black/[0.125] size-10 rounded-full'
                                    style={{
                                        backdropFilter: "blur(5px)",
                                    }}
                                >
                                    <SwapHorizRoundedIcon className='!text-white z-10 !size-5' />
                                </div>
                            </div>
                        }
                    />
                </div>
            }
        </CustomModal>
    )
}

export default CompareImages