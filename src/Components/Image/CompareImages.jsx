import React from 'react'
import CustomModal from '../Modal/CustomModal'
import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider";
import SwapHorizRoundedIcon from '@mui/icons-material/SwapHorizRounded';

const CompareImages = ({ open, handleClose, imagen, captura }) => {
    return (
        <CustomModal Open={open} handleClose={handleClose} className={'max-w-md'}>
            <div className="w-full max-w-lg mx-auto">
                <ReactCompareSlider
                    itemOne={<ReactCompareSliderImage src={imagen} alt="Imagen 1" />}
                    itemTwo={<ReactCompareSliderImage src={captura} alt="Imagen 2" />}
                    style={{
                        width: "100%",
                        height: "400px",
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
        </CustomModal>
    )
}

export default CompareImages