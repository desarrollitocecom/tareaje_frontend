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
import Error404 from '../Pages/Error404';
import Buscador from '../Pages/Buscador';
import PersonalBD from '../Pages/PersonalBD';
import PersonaIdentificado from '../Pages/PersonaIdentificado';
import Roles from '../Pages/Roles/Roles';
import Empleado from '../Pages/Empleado/Empleado';
import Cargo from '../Pages/Cargo/Cargo';
import Sexo from '../Pages/Sexo/Sexo';
import GradoEstudio from '../Pages/GradoEstudio/GradoEstudio';
import Subgerencia from '../Pages/Subgerencia/Subgerencia ';
import Funcion from '../Pages/Funcion/Funcion';
import Jurisdiccion from '../Pages/Jurisdiccion/Jurisdiccion';
import LugarTrabajo from '../Pages/LugarTrabajo/LugarTrabajo';

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
              element: <PrivateRouter element={<Buscador />} />,
            },
            {
              path: "/buscar/:id",
              element: <PrivateRouter element={<PersonaIdentificado />} />,
            }
          ]
        },
        {
          path: "/roles",
          element: <PrivateRouter element={<Roles />} />,
        },
        // {
        //   path: "/usuarios",
        //   element: <PrivateRouter element={<Usuarios />} />,
        // },
        {
           path: "/empleado",
           element: <PrivateRouter element={<Empleado />} />,
        },
        {
          path: "/cargo",
          element: <PrivateRouter element={<Cargo />} />,
        },
        {
          path: "/sexo",
          element: <PrivateRouter element={<Sexo />} />,
        },
        {
          path: "/grado-estudio",
          element: <PrivateRouter element={<GradoEstudio />} />,
        },
        {
          path: "/subgerencia",
          element: <PrivateRouter element={<Subgerencia />} />,
        },
        {
          path: "/funcion",
          element: <PrivateRouter element={<Funcion />} />,
        },
        // {
        //   path: "/turno",
        //   element: <PrivateRouter element={<Turno />} />,
        // },
        // {
        //   path: "/regimen-laboral",
        //   element: <PrivateRouter element={<RegimenLaboral />} />,
        // },
        // {
        //   path: "/vacaciones",
        //   element: <PrivateRouter element={<Vacaciones />} />,
        // },
        // {
        //   path: "/descansos",
        //   element: <PrivateRouter element={<Descansos />} />,
        // },
        // {
        //   path: "/feriados",
        //   element: <PrivateRouter element={<Feriados />} />,
        // },
        // {
        //   path: "/justificaciones",
        //   element: <PrivateRouter element={<Justificaciones />} />,
        // },
        {
           path: "/jurisdiccion",
           element: <PrivateRouter element={<Jurisdiccion />} />,
        },
        {
           path: "/lugar-trabajo",
          element: <PrivateRouter element={<LugarTrabajo />} />,
        },
        {
          path: "/error-403",
          element: <PrivateRouter element={<Error403 />} />,
        },
        {
          path: "/*",
          element: <PrivateRouter element={<Error404 />} />,
        },
      ]
    },

  ]);

  return (
    <RouterProvider router={router} />
  )
}

export default AppRouter;
