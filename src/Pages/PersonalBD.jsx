import React from "react";
import { Formik, Form } from 'formik';
import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, Paper } from '@mui/material';
import useData from "../Components/Hooks/UseDB";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { Link, useNavigate } from "react-router-dom";

const PersonalBD = () => {
  const { data, cargos, turnos } = useData();
  const navigate = useNavigate()

  return (
    <div className="w-full bg-gray-100 px-6 py-8 h-full flex flex-col overflow-auto overflow-y-scroll">
      <header className="text-white bg-green-700 py-4 px-3 mb-6 w-full rounded-lg flex justify-center relative">
        <Link onClick={() => navigate(-1)} className='flex items-center gap-1'>
          <ArrowBackIosNewRoundedIcon
            className='!size-5 md:!size-6 mt-[0.1rem] absolute left-4'
          />
        </Link>
        <h1 className="md:text-2xl lg:text-4xl font-bold text-center">
          BASE DE DATOS DEL PERSONAL
        </h1>
      </header>
      <Formik
        initialValues={{ buscar: '', cargo: '', turnos: '' }}      >
        {({ isSubmitting, handleChange, handleBlur, values, errors, touched }) => (
          <Form>
            <div className="text-nowrap">
              <div elevation={3} sx={{ padding: 3, borderRadius: 2 }} className="flex flex-col lg:flex-row gap-4">

                <div className="w-full">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Box>
                        <TextField
                          fullWidth
                          variant="outlined"
                          label="Buscar"
                          name="buscar"
                          size="small"
                          className="bg-white"
                          value={values.buscar || ''}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Box>
                    </div>

                    <div>
                      <Box>
                        <FormControl fullWidth variant="outlined" size="small" className="bg-white" error={touched.cargo && Boolean(errors.cargo)}>
                          <InputLabel id="cargo-label">Cargo</InputLabel>
                          <Select
                            labelId="cargo-label"
                            label="Cargo"
                            name="cargo"
                            value={values.cargo || ''}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          >
                            <MenuItem value="">
                              <em>Ninguno</em>
                            </MenuItem>
                            {cargos.map((cargo) => (
                              <MenuItem key={cargo.id} value={cargo.id}>{cargo.valor}</MenuItem>
                            ))}
                          </Select>
                          {touched.cargo && errors.cargo && (
                            <FormHelperText error>{errors.cargo}</FormHelperText>
                          )}
                        </FormControl>
                      </Box>
                    </div>

                    <div>
                      <Box>
                        <FormControl fullWidth variant="outlined" size="small" className="bg-white" error={touched.turno && Boolean(errors.turno)}>
                          <InputLabel id="turno-label">Turno</InputLabel>
                          <Select
                            labelId="turno-label"
                            label="Turnos"
                            name="turnos"
                            value={values.turnos || ''}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          >
                            <MenuItem value="">
                              <em>Ninguno</em>
                            </MenuItem>
                            {turnos.map((turno) => (
                              <MenuItem key={turno.id} value={turno.id}>{turno.valor}</MenuItem>
                            ))}
                          </Select>
                          {touched.turno && errors.turno && (
                            <FormHelperText error>{errors.turno}</FormHelperText>
                          )}
                        </FormControl>
                      </Box>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4 lg:max-w-xs">
                  <div className="flex justify-center w-full">
                    <Button
                      className="w-full md:w-auto"
                      variant="contained"
                      color="primary"
                      type="button"
                      size="small"
                    >
                      Descargar Excel
                    </Button>
                  </div>

                  <div className="flex justify-center w-full">
                    <Button
                      className="w-full md:w-auto"
                      variant="contained"
                      color="primary"
                      type="button"
                      size="small"
                    >
                      Importar Excel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>

      <div className="overflow-x-auto mt-6">
        <table className="min-w-full table-auto border-collapse bg-white shadow-md rounded-lg">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="p-2">#</th>
              <th className="p-2">Foto</th>
              <th className="p-2">Apellido</th>
              <th className="p-2">Nombre</th>
              <th className="p-2">DNI</th>
              <th className="p-2">Cargo</th>
              <th className="p-2">Turno</th>
              <th className="p-2">Eliminar</th>
              <th className="p-2">Actualizar</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={item.id}
                className={`border-t ${index % 2 === 0 ? "bg-white" : "bg-gray-100"}`}
              >
                <td className="p-2 text-center">{index + 1}</td>
                <td className="p-2 text-center min-w-20">
                  <img
                    src={item.imagen}
                    alt="Imagen de usuario"
                    className="max-w-20  object-cover mx-auto rounded-lg aspect-square"
                  />
                </td>
                <td className="p-2 text-center">{item.apellido}</td>
                <td className="p-2 text-center">{item.nombre}</td>
                <td className="p-2 text-center">{item.dni}</td>
                <td className="p-2 text-center">{item.puesto}</td>
                <td className="p-2 text-center">{item.turno}</td>
                <td className="p-2 text-center"><button className="p-2 text-center"><DeleteIcon /></button></td>
                <td className="p-2 text-center"><button className="p-2 text-center"><EditIcon /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PersonalBD;
