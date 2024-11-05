import React from 'react'
import Logo from '../../assets/logos/logo_sjl.png'

const Loader = () => {
    return (
        <div id='loader' className='bg-white/80 z-[9999] fixed top-0 left-0 w-full h-full flex items-center justify-center'>
            <div className='container flex items-center justify-center'>
                <img className='max-w-[200px] animate-scaleUpDown drop-shadow-md' src={Logo} alt="logo_sjl" />
            </div>
        </div>
    )
}

export default Loader