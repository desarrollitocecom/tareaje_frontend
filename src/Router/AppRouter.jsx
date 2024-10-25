import React from 'react'
import PrivateRouter from './PrivateRouter';
import PublicRouter from './PublicRouter';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import Layout from '../Pages/Layout';
import Inicio from '../Pages/Inicio';
import AsistenciaPersonal from "../Pages/AsistenciaPersonal";
import SeguimientoAsistencia from "../Pages/SeguimientoAsitencia";
import Login from '../Pages/Login';
import Error403 from '../Pages/Error403';
import PersonalBD from '../Pages/PersonalBD';
import PersonaIdentificado from '../Pages/PersonaIdentificado';

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
          element: <PrivateRouter element={<PersonalBD />} />,
        },
        {
          path: "/AsistenciaPersonal",
          element: <PrivateRouter element={<AsistenciaPersonal />} />,
        },
        {
          path: "/SeguiminetoAsistencia",
          element: <PrivateRouter element={<SeguimientoAsistencia />} />,
        },
        {
          path: "/buscar",
          element: <PrivateRouter element={<Outlet />} />,
          children: [
            {
              path: "/buscar",
              element: <PrivateRouter element={<Outlet />} />,
            },
            {
              path: "/buscar/:id",
              element: <PrivateRouter element={<PersonaIdentificado />} />,
            }
          ]
        },
        {
          path: "/error",
          element: <PrivateRouter element={<Error403 />} />,
        },
      ]
    },

  ]);

  return (
    <RouterProvider router={router} />
  )
}

export default AppRouter;
