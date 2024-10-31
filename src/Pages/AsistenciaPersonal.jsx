import React from "react";
import { Formik, Form } from "formik";
import useData from "../Components/Hooks/UseDB";
import { Link, useNavigate } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import FiltroSelect from "../Components/Filtroselect/Filtro";
import { TextField } from "@mui/material";

const AsistenciaPersonal = () => {
  const { data, cargos, turnos } = useData();

  return (
    <div className="w-full bg-gray-100 px-6 py-8 h-full flex flex-col overflow-auto overflow-y-scroll">
      <header className="text-white bg-green-700 py-4 px-3 mb-6 w-full rounded-lg flex justify-center relative">
        <Link onClick={() => navigate(-1)} className="flex items-center gap-1">
          <ArrowBackIosNewRoundedIcon
            className="!size-5 md:!size-6 mt-[0.1rem] absolute left-4"
          />
        </Link>
        <h1 className="md:text-2xl lg:text-4xl font-bold text-center">
          ASISTENCIA DEL PERSONAL
        </h1>
      </header>

      <Formik
        initialValues={{
          buscar: "",
          fecha: null, // Iniciar con null para el DatePicker
          cargo: "",
          turno: "",
        }}
        onSubmit={(values) => {
          // Aquí puedes manejar la lógica de envío del formulario
          console.log("Valores del formulario:", values);
        }}
      >
        {({ handleChange, handleBlur, values, setFieldValue, errors, touched }) => (
          <Form className="flex flex-col flex-1 text-nowrap">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 text-sm">
              {/* Buscar */}
              <div className="md:col-span-1">
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Buscar"
                  name="buscar"
                  size="small"
                  className="bg-white"
                  value={values.buscar}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>

              {/* Seleccionar Fecha */}
              <div className="flex flex-col">
                  <DatePicker
                    label="Seleccionar Fecha"
                    value={values.fecha}
                    slotProps={{ textField: { size: 'small' } }}
                    className="bg-white"
                    onChange={(value) => setFieldValue("fecha", value)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        className="bg-white"
                        error={Boolean(errors.fecha && touched.fecha)}
                        helperText={touched.fecha && errors.fecha}
                      />
                    )}
                  />
              </div>

              {/* Seleccionar Cargo */}
              <div>
                <FiltroSelect
                  label="Cargo"
                  name="cargo"
                  value={values.cargo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={cargos}
                  error={errors.cargo}
                  touched={touched.cargo}
                />
              </div>

              {/* Seleccionar Turno */}
              <div>
                <FiltroSelect
                  label="Turno"
                  name="turno"
                  value={values.turno}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={turnos}
                  error={errors.turno}
                  touched={touched.turno}
                />
              </div>
            </div>

            {/* Tabla de asistencia */}
            <div className="overflow-x-auto text-sm text-nowrap">
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
                      className={`border-t ${index % 2 === 0 ? "bg-white" : "bg-gray-100"}`}
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
                      <td className="p-2 text-center min-w-20">
                        <img
                          src={item.imagen}
                          alt="Imagen de usuario"
                          className="max-w-20 object-cover mx-auto rounded-lg aspect-square"
                        />
                      </td>
                      <td className="p-2 text-center min-w-20">
                        <img
                          src={item.captura}
                          alt="Imagen de usuario"
                          className="max-w-20 object-cover mx-auto rounded-lg aspect-square"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AsistenciaPersonal;
