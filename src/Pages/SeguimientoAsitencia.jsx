import React, { useState } from "react";
import useDataSeguimiento from "../Components/hooks/useDataSeguimiento"; // Importa el hook

const SeguimientoAsistencia = () => {
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
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="text-white bg-green-700 py-4 mb-6 w-full rounded-lg">
        <h1 className="text-4xl font-bold text-center">
          SEGUIMIENTO DE ASISTENCIAS
        </h1>
      </header>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        {/* Navegación de semanas */}
        <div className="flex justify-between items-center mb-4">
          <button
            className="bg-gray-300 p-2 rounded-lg"
            onClick={handleSemanaAnterior}
          >
            &lt; Semana Anterior
          </button>
          <span className="text-lg font-semibold">
            {formatDate(startDate)} - {formatDate(fechasSemana[6])}
          </span>
          <button
            className="bg-gray-300 p-2 rounded-lg"
            onClick={handleSemanaSiguiente}
          >
            Semana Siguiente &gt;
          </button>
        </div>

        {/* Búsqueda por mes y año */}
        <div className="mb-4">
          <button
            className="flex items-center w-full p-2 bg-gray-200 rounded-lg"
            onClick={() => setIsMesAnoOpen(!isMesAnoOpen)}
          >
            <span className="font-medium">Búsqueda por mes y año</span>
          </button>
          {isMesAnoOpen && (
            <div className="flex items-center gap-4 mt-2 w-full">
              <div className="w-3/4">
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
              <div className="w-3/4">
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
              <div className="w-3/4 mt-8">
                <button className="w-full bg-green-500 text-white p-2 rounded-lg">
                  Descargar Excel
                </button>
              </div>
            </div>
          )}
        </div>
        {/* Búsqueda por intervalo */}
        <div className="mb-4">
          <button
            className="flex items-center w-full p-2 bg-gray-200 rounded-lg"
            onClick={() => setIsIntervaloOpen(!isIntervaloOpen)}
          >
            <span className="font-medium">Búsqueda por intervalo</span>
          </button>
          {isIntervaloOpen && (
            <div className="flex items-center gap-4 mt-2 w-full">
              {" "}
              {/* Flexbox con w-full para ocupar todo el espacio */}
              <div className="w-3/4">
                <label className="block mb-2 font-medium">
                  Seleccionar fecha inicial:
                </label>
                <input type="date" className="w-full p-2 border rounded-lg" />
              </div>
              <div className="w-3/4">
                <label className="block mb-2 font-medium">
                  Seleccionar fecha final:
                </label>
                <input type="date" className="w-full p-2 border rounded-lg" />
              </div>
              <div className="w-3/4 mt-8">
                <button className="w-full bg-green-500 text-white p-2 rounded-lg">
                  Descargar Excel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Cambio de Asistencia */}
        <div className="mb-4">
          <button
            className="flex items-center w-full p-2 bg-gray-200 rounded-lg"
            onClick={() => setIsAsistenciaOpen(!isAsistenciaOpen)}
          >
            <span className="font-medium">Cambio de Asistencia</span>
          </button>
          {isAsistenciaOpen && (
            <div className="flex gap-4 mt-2">
              <button className="w-full bg-purple-500 text-white p-2 rounded-lg">
                Activar Edición
              </button>
              <button className="w-full bg-green-600 text-white p-2 rounded-lg">
                Guardar Cambios
              </button>
            </div>
          )}
        </div>

        {/* Filtrar por turno */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">Filtrar por turno:</label>
          <select className="w-full p-2 border rounded-lg">
            {turnos.map((turno, index) => (
              <option key={index} value={turno}>
                {turno}
              </option>
            ))}
          </select>
        </div>

        {/* Tabla de asistencias */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
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
    </div>
  );
};

export default SeguimientoAsistencia;
