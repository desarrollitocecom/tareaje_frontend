import React, { useState } from "react";
import useDataSeguimiento from "../Components/hooks/useDataSeguimiento"; // Importa el hook
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link, useNavigate } from "react-router-dom";

const SeguimientoAsistencia = () => {
  const navigate = useNavigate()
  const [startDate, setStartDate] = useState(new Date(2024, 9, 7)); // Fecha de inicio (2024-10-07)
  const [isMesAnoOpen, setIsMesAnoOpen] = useState(false);
  const [isIntervaloOpen, setIsIntervaloOpen] = useState(false);
  const [isAsistenciaOpen, setIsAsistenciaOpen] = useState(false);

  const { datosAsistencias, meses, anios, turnos } = useDataSeguimiento();

  // Función para cambiar a la semana anterior
  const handleSemanaAnterior = () => {
    setStartDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() - 7); // Restar 7 días
      return newDate;
    });
  };

  // Función para cambiar a la semana siguiente
  const handleSemanaSiguiente = () => {
    setStartDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() + 7); // Sumar 7 días
      return newDate;
    });
  };

  // Función para formatear la fecha
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Los meses empiezan en 0
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Obtener las fechas de la semana (de lunes a domingo)
  const fechasSemana = Array.from({ length: 7 }, (_, i) => {
    const newDate = new Date(startDate);
    newDate.setDate(startDate.getDate() + i); // Agregar días
    return newDate;
  });

  return (
    <div className="w-full bg-gray-100 px-6 py-8 h-full flex flex-col overflow-auto overflow-y-scroll">
      <header className="text-white bg-green-700 py-4 px-3 mb-6 w-full rounded-lg flex justify-center relative">
        <Link onClick={() => navigate(-1)} className='flex items-center gap-1'>
          <ArrowBackIosNewRoundedIcon
            className='!size-5 md:!size-6 mt-[0.1rem] absolute left-4'
          />
        </Link>
        <h1 className="md:text-2xl lg:text-4xl font-bold text-center">
          SEGUIMIENTO DE ASISTENCIAS
        </h1>
      </header>

      <div className="bg-white p-6 rounded-lg shadow-lg text-sm flex flex-col flex-1">
        {/* Navegación de semanas */}
        <div className="flex justify-between items-center mb-4">
          <button
            className="bg-gray-300 p-2 rounded-lg flex items-center justify-center gap-1"
            onClick={handleSemanaAnterior}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 14 }} />
            <div className="text-nowrap hidden lg:flex">Semana Anterior</div>
          </button>
          <span className="text-base font-semibold">
            {formatDate(startDate)} - {formatDate(fechasSemana[6])}
          </span>
          <button
            className="bg-gray-300 p-2 rounded-lg flex items-center justify-center gap-1"
            onClick={handleSemanaSiguiente}
          >
            <div className="text-nowrap hidden lg:flex">Semana Siguiente</div>
            <ArrowForwardIosRoundedIcon sx={{ fontSize: 14 }} />
          </button>
        </div>

        {/* Búsqueda por mes y año */}
        <Accordion className="mb-4 text-sm"
          sx={{
            boxShadow: "none",
            borderColor: "transparent",
            padding: "0px 0px",
          }}
          expanded={isMesAnoOpen}
        >
          <AccordionSummary
            className="flex items-center w-full p-2 bg-gray-200 rounded-lg"
            onClick={() => setIsMesAnoOpen(!isMesAnoOpen)}
            sx={{
              backgroundColor: "rgb(229 231 235 / 1) ",
              padding: "0px 16px",
              borderRadius: "8px",
              '.Mui-expanded': {
                margin: 0,
              },
            }}
            expandIcon={<ExpandMoreIcon />}
          >
            <span className="font-medium">Búsqueda por mes y año</span>
          </AccordionSummary >
          <AccordionDetails
            className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full"
          >
            <div>
              <label className="block mb-2 font-medium">
                Seleccionar mes:
              </label>
              <select className="w-full p-2 border rounded-lg">
                {meses.map((mes, index) => (
                  <option key={index} value={mes}>
                    {mes}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2 font-medium">
                Seleccionar año:
              </label>
              <select className="w-full p-2 border rounded-lg">
                {anios.map((anio, index) => (
                  <option key={index} value={anio}>
                    {anio}
                  </option>
                ))}
              </select>
            </div>
            <div className="h-full flex items-end">
              <button className="w-full bg-green-500 text-white p-2 rounded-lg">
                Descargar Excel
              </button>
            </div>
          </AccordionDetails>
        </Accordion>
        {/* Búsqueda por intervalo */}
        <Accordion className="mb-4 text-sm"
          sx={{
            boxShadow: "none",
            borderColor: "transparent",
            padding: "0px 0px",
          }}
        >
          <AccordionSummary
            className="flex items-center w-full bg-gray-200"
            onClick={() => setIsIntervaloOpen(!isIntervaloOpen)}
            sx={{
              backgroundColor: "rgb(229 231 235 / 1) ",
              padding: "0px 16px",
              borderRadius: "8px",
              '.Mui-expanded': {
                margin: 0,
              },
            }}
            expandIcon={<ExpandMoreIcon />}
          >
            <span className="font-medium">Búsqueda por intervalo</span>
          </AccordionSummary>
          <AccordionDetails className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 w-full">
            {/* Flexbox con w-full para ocupar todo el espacio */}
            <div>
              <label className="block mb-2 font-medium">
                Seleccionar fecha inicial:
              </label>
              <input type="date" className="w-full p-2 border rounded-lg" />
            </div>
            <div>
              <label className="block mb-2 font-medium">
                Seleccionar fecha final:
              </label>
              <input type="date" className="w-full p-2 border rounded-lg" />
            </div>
            <div>
              <button className="w-full bg-green-500 text-white p-2 rounded-lg">
                Descargar Excel
              </button>
            </div>
          </AccordionDetails>
        </Accordion>

        {/* Cambio de Asistencia */}
        <Accordion className="mb-4 text-sm"
          sx={{
            boxShadow: "none",
            borderColor: "transparent",
            padding: "0px 0px",
          }}
        >
          <AccordionSummary
            className="flex items-center w-full bg-gray-200"
            onClick={() => setIsAsistenciaOpen(!isAsistenciaOpen)}
            sx={{
              backgroundColor: "rgb(229 231 235 / 1) ",
              padding: "0px 16px",
              borderRadius: "8px",
              '.Mui-expanded': {
                margin: 0,
              },
            }}
            expandIcon={<ExpandMoreIcon />}
          >
            <span className="font-medium">Cambio de Asistencia</span>
          </AccordionSummary>
          <AccordionDetails className="flex gap-4 mt-2">
            <button className="w-full bg-purple-500 text-white p-2 rounded-lg">
              Activar Edición
            </button>
            <button className="w-full bg-green-600 text-white p-2 rounded-lg">
              Guardar Cambios
            </button>
          </AccordionDetails>
        </Accordion>

        {/* Filtrar por turno */}
        <div className="mb-4 text-sm flex">
          <div className="w-full sm:max-w-60">
            <label className="block mb-2 font-medium">Filtrar por turno:</label>
            <select className="w-full p-2 border rounded-lg">
              {turnos.map((turno, index) => (
                <option key={index} value={turno}>
                  {turno}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabla de asistencias */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border text-xs text-nowrap">
            <thead>
              <tr>
                <th className="py-2 px-4 border">APELLIDO</th>
                <th className="py-2 px-4 border">DNI</th>
                <th className="py-2 px-4 border">TURNO</th>
                {fechasSemana.map((fecha, i) => (
                  <th key={i} className="py-2 px-4 border">
                    {fecha
                      .toLocaleString("es-ES", { weekday: "short" })
                      .toUpperCase()}
                    <br />
                    {formatDate(fecha)}
                  </th>
                ))}
                <th className="py-2 px-4 border">ACCIÓN</th>
              </tr>
            </thead>
            <tbody>
              {datosAsistencias.map((asistencia, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border">{asistencia.apellido}</td>
                  <td className="py-2 px-4 border">{asistencia.dni}</td>
                  <td className="py-2 px-4 border">{asistencia.turno}</td>
                  {asistencia.dias.map((dia, diaIndex) => (
                    <td key={diaIndex} className="py-2 px-4 border text-center">
                      {dia}
                    </td>
                  ))}
                  <td className="py-2 px-4 border text-center">
                    <button className="bg-blue-500 text-white p-2 rounded-lg">
                      Más info
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div >
  );
};

export default SeguimientoAsistencia;
