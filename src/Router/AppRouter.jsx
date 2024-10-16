import React from 'react'
import PrivateRouter from './PrivateRouter';
import PublicRouter from './PublicRouter';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import Layout from '../Pages/Layout';
import Inicio from '../Pages/Inicio';

const AppRouter = () => {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <PrivateRouter element={<Layout />} />,
            children: [
                {
                    path: "/",
                    element: <PrivateRouter element={<Inicio />} />,
                },
            ]
        },
        // {
        //     path: "/login",
        //     element: <PublicRouter element={<Login />} />,
        // },
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