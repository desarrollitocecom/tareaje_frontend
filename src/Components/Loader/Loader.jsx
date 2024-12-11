import React from 'react'
import Logo from '../../assets/logos/logo_sjl.png'
import { useSelector } from 'react-redux';

const Loader = () => {
    const { moduleLoading, loading } = useSelector((state) => state.auth);

    const className = moduleLoading ? 'bg-white/90 z-[1000] opacity-100' : loading ? 'bg-white/80 z-[9999] opacity-100' : 'z-[-1] opacity-0';
    return (
        <div id='loader' className={`${className} transition-all absolute top-0 left-0 w-full h-full flex items-center justify-center select-none`}>
            <div className='container flex items-center justify-center'>
                <img className='max-w-[200px] animate-scaleUpDown drop-shadow-md' src={Logo} alt="logo_sjl" />
            </div>
        </div>
    )
}

export default Loader