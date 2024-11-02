import React from 'react'
import PrivateRouter from './PrivateRouter';
import PublicRouter from './PublicRouter';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import Layout from '../Pages/Layout';
import Inicio from '../Pages/Inicio';
import AsistenciaPersonal from "../Pages/AsistenciaPersonal";
import SeguimientoAsistencia from "../Pages/SeguimientoAsitencia";
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
import Usuarios from '../Pages/Usuarios/Usuarios';
import Turno from '../Pages/Turno/Turnos';
import Vacaciones from '../Pages/Vacaciones/Vacaciones';
import Descansos from '../Pages/Descanso/Descansos';
import Feriados from '../Pages/Feriados/Feriados';
import Justificaciones from '../Pages/Justificaciones/Justificaciones';
import RegimenLaboral from '../Pages/Regimen/Regimen';
import Login from '../Pages/Login/Login';
import { useSelector } from 'react-redux';
import Loader from '../Components/Loader/Loader';

const AppRouter = () => {
  const { loading } = useSelector((state) => state.auth);
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
          path: "/base-datos",
          element: <PrivateRouter element={<PersonalBD />} />,
        },
        {
          path: "/asistencia-personal",
          element: <PrivateRouter element={<AsistenciaPersonal />} />,
        },
        {
          path: "/seguimineto-asistencia",
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
        {
          path: "/usuarios",
          element: <PrivateRouter element={<Usuarios />} />,
        },
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
        {
          path: "/turno",
          element: <PrivateRouter element={<Turno />} />,
        },
        {
          path: "/regimen-laboral",
          element: <PrivateRouter element={<RegimenLaboral />} />,
        },
        {
          path: "/vacaciones",
          element: <PrivateRouter element={<Vacaciones />} />,
        },
        {
          path: "/descansos",
          element: <PrivateRouter element={<Descansos />} />,
        },
        {
          path: "/feriados",
          element: <PrivateRouter element={<Feriados />} />,
        },
        {
          path: "/justificaciones",
          element: <PrivateRouter element={<Justificaciones />} />,
        },
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
    <>
      {loading && <Loader />}
      <RouterProvider router={router} />
    </>
  )
}

export default AppRouter;
