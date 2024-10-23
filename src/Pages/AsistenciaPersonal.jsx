import React from "react";
import useData from "../Components/hooks/UseData";

const AsistenciaPersonal = () => {
  const { data, cargos, turnos } = useData();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center text-white bg-green-700 py-4 mb-6 rounded-lg">
        ASISTENCIA DEL PERSONAL
      </h1>

      <div className="grid grid-cols-4 gap-4 mb-4">
        {/* Buscar */}
        <div className="flex flex-col">
          <label className="mb-1 font-semibold">Buscar</label>
          <input
            type="text"
            placeholder="Buscar"
            className="border border-gray-300 rounded-lg p-2  "
          />
        </div>

        {/* Seleccionar Fecha */}
        <div className="flex flex-col">
          <label className="mb-1 font-semibold">Seleccionar Fecha</label>
          <input
            type="date"
            className="border border-gray-300 rounded-lg p-2 "
          />
        </div>

        {/* Seleccionar Cargo */}
        <div className="flex flex-col">
          <label className="mb-1 font-semibold">Seleccionar Cargo</label>
          <select className="border border-gray-300 rounded-lg p-2 ">
            <option value="">Todos los Cargos</option>
            {cargos.map((cargo) => (
              <option key={cargo.id} value={cargo.valor}>
                {cargo.valor}
              </option>
            ))}
          </select>
        </div>

        {/* Seleccionar Turno */}
        <div className="flex flex-col">
          <label className="mb-1 font-semibold">Seleccionar Turno</label>
          <select className="border border-gray-300 rounded-lg p-2 ">
            <option value="">Todos los Turnos</option>
            {turnos.map((turno) => (
              <option key={turno.id} value={turno.valor}>
                {turno.valor}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabla de asistencia */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse bg-white shadow-md rounded-lg">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="p-2">#</th>
              <th className="p-2">Nombre</th>
              <th className="p-2">Apellido</th>
              <th className="p-2">DNI</th>
              <th className="p-2">Puesto</th>
              <th className="p-2">Turno</th>
              <th className="p-2">Fecha y Hora</th>
              <th className="p-2">Imagen</th>
              <th className="p-2">Captura</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={item.id}
                className={`border-t ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-100"
                }`} 
              >
                <td className="p-2 text-center">{index + 1}</td>
                <td className="p-2 text-center">{item.nombre}</td>
                <td className="p-2 text-center">{item.apellido}</td>
                <td className="p-2 text-center">{item.dni}</td>
                <td className="p-2 text-center">{item.puesto}</td>
                <td className="p-2 text-center">{item.turno}</td>
                <td className="p-2 text-center">
                  {item.fecha}, {item.hora}
                </td>
                <td className="p-2 text-center">
                  <img
                    src={item.imagen}
                    alt="Imagen de usuario"
                    className="w-24 h-24 object-cover mx-auto rounded-lg" 
                  />
                </td>
                <td className="p-2 text-center">
                  <img
                    src={item.captura}
                    alt="Imagen de usuario"
                    className="w-24 h-24 object-cover mx-auto rounded-lg" 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AsistenciaPersonal;
