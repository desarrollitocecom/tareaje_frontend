import React from "react";
import PrivateRouter from "./PrivateRouter";
import PublicRouter from "./PublicRouter";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Layout from "../Pages/Layout";
import Inicio from "../Pages/Inicio";
import AsistenciaPersonal from "../Pages/AsistenciaPersonal";
import SeguimientoAsistencia from "../Pages/SeguimientoAsitencia";

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
      ],
    },

    // {
    //     path: "/login",
    //     element: <PublicRouter element={<Login />} />,
    // },
    // {
    //     path: "/registro",
    //     element: <PublicRouter element={<Register />} />,
    // },
    
    {
      path: "/",
      element: <PrivateRouter element={<Layout />} />,
      children: [
        {
          path: "/AsistenciaPersonal",
          element: <PrivateRouter element={<AsistenciaPersonal />} />,
        },
      ],
    },
    {
      path: "/",
      element: <PrivateRouter element={<Layout />} />,
      children: [
        {
          path: "/SeguiminetoAsistencia",
          element: <PrivateRouter element={<SeguimientoAsistencia />} />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AppRouter;
