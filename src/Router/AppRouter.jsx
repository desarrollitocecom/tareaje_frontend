import React, { useEffect } from 'react'
import PrivateRouter from './PrivateRouter';
import PublicRouter from './PublicRouter';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import Layout from '../Pages/Layout';
import Inicio from '../Pages/Inicio';
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
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../Components/Loader/Loader';
import SeguimientoAsistencia from '../Pages/SeguimientoAsistencia/SeguimientoAsitencia';
import AsistenciaPersonal from '../Pages/AsistenciaPersonal/AsistenciaPersonal';
import { setLoading } from '../Redux/Slices/AuthSlice';
import Horarios from '../Pages/Horarios/Horarios';

const AppRouter = () => {
  const future = {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true
  }

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
          element: <PrivateRouter element={<PersonalBD />} requiresPermission={"asistencia"} />,
        },
        {
          path: "/asistencia-personal",
          element: <PrivateRouter element={<AsistenciaPersonal />} requiresPermission={"asistencia"} />,
        },
        {
          path: "/seguimiento-asistencia",
          element: <PrivateRouter element={<SeguimientoAsistencia />} requiresPermission={"asistencia"} />,
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
          element: <PrivateRouter element={<Roles />} requiresPermission={"rol"} />,
        },
        {
          path: "/usuarios",
          element: <PrivateRouter element={<Usuarios />} requiresPermission={"usuario"} />,
        },
        {
          path: "/empleado",
          element: <PrivateRouter element={<Empleado />} requiresPermission={"empleado"} />,
        },
        {
          path: "/cargo",
          element: <PrivateRouter element={<Cargo />} requiresPermission={"cargo"} />,
        },
        {
          path: "/sexo",
          element: <PrivateRouter element={<Sexo />} requiresPermission={"sexo"} />,
        },
        {
          path: "/grado-estudio",
          element: <PrivateRouter element={<GradoEstudio />} requiresPermission={"gradoDeEstudio"} />,
        },
        {
          path: "/subgerencia",
          element: <PrivateRouter element={<Subgerencia />} requiresPermission={"subgerencia"} />,
        },
        {
          path: "/funcion",
          element: <PrivateRouter element={<Funcion />} requiresPermission={"funcion"} />,
        },
        {
          path: "/turno",
          element: <PrivateRouter element={<Turno />} requiresPermission={"turno"} />,
        },
        {
          path: "/regimen-laboral",
          element: <PrivateRouter element={<RegimenLaboral />} requiresPermission={"regimenLaboral"} />,
        },
        {
          path: "/vacaciones",
          element: <PrivateRouter element={<Vacaciones />} requiresPermission={"vacacion"} />,
        },
        {
          path: "/descansos",
          element: <PrivateRouter element={<Descansos />} requiresPermission={"descanso"} />,
        },
        {
          path: "/feriados",
          element: <PrivateRouter element={<Feriados />} requiresPermission={"feriado"} />,
        },
        {
          path: "/justificaciones",
          element: <PrivateRouter element={<Justificaciones />} requiresPermission={"justificacion"} />,
        },
        {
          path: "/jurisdiccion",
          element: <PrivateRouter element={<Jurisdiccion />} requiresPermission={"jurisdiccion"} />,
        },
        {
          path: "/lugar-trabajo",
          element: <PrivateRouter element={<LugarTrabajo />} requiresPermission={"lugarDeTrabajo"} />,
        },
        {
          path: '/horario',
          element: <PrivateRouter element={<Horarios />} requiresPermission={"rangohorarios"} />,
        },
        {
          path: "/*",
          element: <PrivateRouter element={<Error404 />} />,
        },
      ]
    },

  ], {
    future: future
  });

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setLoading(false));
  }, [])



  return (
    <>
      {loading && <Loader />}
      <RouterProvider
        router={router}
        future={future}
      />
    </>
  )
}

export default AppRouter;
