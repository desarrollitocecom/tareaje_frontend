import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../Components/Navigation/Sidebar'
import Header from '../Components/Navigation/Header'
import UseLogin from './Login/UseLogin'
import { useDispatch, useSelector } from 'react-redux'
import CustomSwal from '../helpers/swalConfig'
import { loginSuccess, logout, setIsLogin } from '../Redux/Slices/AuthSlice'
import { socket } from '../Components/Socket/socket'
import Loader from '../Components/Loader/Loader'

const Layout = () => {
    const [toggled, setToggled] = useState(false);
    const dispatch = useDispatch();
    const { refresh, token, isLogin } = useSelector((state) => state.auth);
    const { getUserData } = UseLogin()

    useEffect(() => {
        if (!isLogin) {
            console.log('Se ejecuto el login');
            
            const fetchData = async () => {
                try {
                    const userData = await getUserData(token);
                    dispatch(loginSuccess({ user: userData, token: token }));

                } catch (error) {
                    console.error(error);
                }
            };

            fetchData()

            socket.on('forceLogout', (data) => {
                if (data) {
                    CustomSwal.fire({
                        icon: 'warning',
                        title: 'Nueva sesión detectada',
                        text: 'Revisa la seguridad de tu cuenta si no reconoces esta actividad.',
                        didClose: () => {
                            dispatch(logout());
                        }
                    });
                }
            })
        }

        dispatch(setIsLogin(false))

        return () => {
            socket.off('foreLogout');
        }

    }, [refresh])

    return (
        <div className='flex h-full w-full'>
            <Sidebar toggled={toggled} setToggled={setToggled} />
            <div className='w-full overflow-auto flex flex-col relative'>
                <Loader />
                <Header toggled={toggled} setToggled={setToggled} />
                <div className='content-body bg-gray-100 flex flex-1 overflow-hidden'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Layout