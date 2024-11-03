import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../Components/Navigation/Sidebar'
import Header from '../Components/Navigation/Header'
import UseLogin from './Login/UseLogin'
import { useDispatch, useSelector } from 'react-redux'
import CustomSwal from '../helpers/swalConfig'
import { logout } from '../Redux/Slices/AuthSlice'

const Layout = () => {
    const [toggled, setToggled] = useState(false);
    const dispatch = useDispatch();
    const { refresh, token } = useSelector((state) => state.auth);
    const { getUserData } = UseLogin()

    useEffect(() => {
        const fetchData = async () => {

            try {
                const userData = await getUserData(token);
                dispatch(loginSuccess({ user: userData, token: token }));

            } catch (error) {
                CustomSwal.fire({
                    icon: 'error',
                    title: 'La sesion ha caducado',
                    text: 'Por favor, vuelve a iniciar sesión para continuar.',
                    didClose: () => {
                        dispatch(logout());
                    }
                })

                console.error("Error fetching user data:", error);
            }
        };

        fetchData()
    }, [refresh])

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