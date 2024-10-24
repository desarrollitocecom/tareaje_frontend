import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../Components/Navigation/Sidebar'
import Header from '../Components/Navigation/Header'

const Layout = () => {
    const [toggled, setToggled] = useState(false);

    return (
        <div className='flex h-full w-full'>
            <Sidebar toggled={toggled} setToggled={setToggled} />
            <div className='w-full overflow-auto flex flex-col'>
                <Header toggled={toggled} setToggled={setToggled} />
                <div className='content-body bg-gray-100 flex flex-1 overflow-hidden'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Layout