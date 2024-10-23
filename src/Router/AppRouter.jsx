import React from 'react'
import PrivateRouter from './PrivateRouter';
import PublicRouter from './PublicRouter';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import Layout from '../Pages/Layout';
import Inicio from '../Pages/Inicio';
import Login from '../Pages/Login';
import Db from '../Pages/Db';
import Error403 from '../Pages/Error403';



const AppRouter = () => {
    const router = createBrowserRouter([
        
        {
            path: "/login",
            element: <PublicRouter element={<Login />} />,
        },
        {
            path: "/",
            element: <PrivateRouter element={<Layout />} />,
            children: [
                {
                    path: "/",
                    element: <PrivateRouter element={<Inicio />} />,
                },
                {
                    path: "/personal",
                    element: <PrivateRouter element={<Db />} />,
                },
                {
                    path: "/error",
                    element: <PrivateRouter element={<Error403 />} />,
                }
            ]
        }
        
        // {
        //     path: "/registro",
        //     element: <PublicRouter element={<Register />} />,
        // },

    ]);

    return (
        <RouterProvider router={router} />
    )
}

export default AppRouter