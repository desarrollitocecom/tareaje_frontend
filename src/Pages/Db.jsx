import React from "react";
import { Formik, Form } from 'formik';
import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, Paper } from '@mui/material';
import useData from "../Components/Hooks/UseDB";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const Db = () => {
  const { data, cargos, turnos } = useData();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center text-white bg-green-700 py-4 mb-6">
        BASE DE DATOS DEL PERSONAL
      </h1>
      <Formik
        initialValues={{ buscar: '', cargo: '', turnos: '' }}      >
        {({ isSubmitting, handleChange, handleBlur, values, errors, touched }) => (
          <Form>
            <div className="grid grid-cols-5 gap-5 mb-4">
              <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }} className="col-span-5 grid grid-cols-5 gap-5">

                { }
                <div className="col-span-1 flex flex-col">
                  <Box mb={2}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Buscar"
                      name="buscar"
                      value={values.buscar || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Box>
                </div>

                { }
                <div className="col-span-1 flex flex-col">
                  <Box mb={2}>
                    <FormControl fullWidth variant="outlined" error={touched.cargo && Boolean(errors.cargo)}>
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

                { }
                <div className="col-span-1 flex flex-col h-10">
                  <Box mb={2}>
                    <FormControl fullWidth variant="outlined" error={touched.turno && Boolean(errors.turno)}>
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

                { }
                <div className="col-span-1 flex flex-col">
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    type="button"
                    sx={{ mt: 2 }}
                  >
                    Descargar Excel
                  </Button>
                </div>

                { }
                <div className="col-span-1 flex flex-col">
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    type="button"
                    sx={{ mt: 2 }}
                  >
                    Importar Excel
                  </Button>
                </div>
              </Paper>
            </div>
          </Form>
        )}
      </Formik>

      { }
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
                <td className="p-2 text-center">
                  <img
                    src={item.imagen}
                    alt="Imagen de usuario"
                    className="w-24 h-24 object-cover mx-auto rounded-lg"
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

export default Db;
