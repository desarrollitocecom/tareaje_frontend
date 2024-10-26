import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import useData from '../Components/hooks/UseData'; 
import { Formik, Form } from 'formik'; 
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText} from '@mui/material'; // Importar componentes de Material-UI
import { Link, useNavigate } from 'react-router-dom';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';

const PersonalBD = () => {
  const { data, cargos, turnos, sexos } = useData(); // Obtiene los datos utilizando el hook personalizado
  const navigate = useNavigate()

  return (
    <div className="w-full bg-gray-100 px-6 py-8 h-full flex flex-col overflow-auto">
      <header className="text-white bg-green-700 py-4 px-3 mb-6 w-full rounded-lg flex justify-center relative">
          <Link onClick={() => navigate(-1)} className='flex items-center gap-1'>
            <ArrowBackIosNewRoundedIcon
              className='!size-5 md:!size-6 mt-[0.1rem] absolute left-4'
            />
          </Link>
          <h1 className="md:text-2xl lg:text-4xl font-bold text-center">
          BUSCADOR
          </h1>
        </header>
      <Formik
        initialValues={{ buscar: '', cargo: '', turnos: '', sexos: '' }}
        onSubmit={(values) => {
          // Manejar el envío del formulario si es necesario
          console.log(values);
        }}
      >
        {({ handleChange, handleBlur, values, errors, touched }) => (
          <Form>
            <div className="text-nowrap mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
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
                          value={values.buscar}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Box>
                    </div>
                    <div>
                      <Box>
                        <FormControl
                          fullWidth
                          variant="outlined"
                          size="small"
                          className="bg-white"
                          error={touched.cargo && Boolean(errors.cargo)}
                        >
                          <InputLabel id="cargo-label">Cargo</InputLabel>
                          <Select
                            labelId="cargo-label"
                            label="Cargo"
                            name="cargo"
                            value={values.cargo}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          >
                            <MenuItem value="">
                              <em>Ninguno</em>
                            </MenuItem>
                            {cargos.map((cargo) => (
                              <MenuItem key={cargo.id} value={cargo.id}>
                                {cargo.valor}
                              </MenuItem>
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
                        <FormControl
                          fullWidth
                          variant="outlined"
                          size="small"
                          className="bg-white"
                          error={touched.turnos && Boolean(errors.turnos)}
                        >
                          <InputLabel id="turno-label">Turno</InputLabel>
                          <Select
                            labelId="turno-label"
                            label="Turnos"
                            name="turnos"
                            value={values.turnos}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          >
                            <MenuItem value="">
                              <em>Ninguno</em>
                            </MenuItem>
                            {turnos.map((turno) => (
                              <MenuItem key={turno.id} value={turno.id}>
                                {turno.valor}
                              </MenuItem>
                            ))}
                          </Select>
                          {touched.turnos && errors.turnos && (
                            <FormHelperText error>{errors.turnos}</FormHelperText>
                          )}
                        </FormControl>
                      </Box>
                    </div>
                    <div>
                      <Box>
                        <FormControl
                          fullWidth
                          variant="outlined"
                          size="small"
                          className="bg-white"
                          error={touched.sexo && Boolean(errors.sexo)}
                        >
                          <InputLabel id="sexo-label">Sexo</InputLabel>
                          <Select
                            labelId="sexo-label"
                            label="Sexo"
                            name="sexo"
                            value={values.sexo}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          >
                            <MenuItem value="">
                              <em>Ninguno</em>
                            </MenuItem>
                            {sexos.map((sexo) => (
                              <MenuItem key={sexo.id} value={sexo.id}>
                                {sexo.valor}
                              </MenuItem>
                            ))}
                          </Select>
                          {touched.sexo && errors.sexo && (
                            <FormHelperText error>{errors.sexo}</FormHelperText>
                          )}
                        </FormControl>
                      </Box>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>

      <div className="flex flex-wrap justify-center gap-4 p-4">
        {data.map((item) => (
          <Link to={`/buscar/${item.id}`} key={item.id}>
          <Card key={item.id} sx={{ maxWidth: 345 }} className="w-full sm:w-72">
            <CardActionArea>
              <CardMedia
                component="img"
                height="140"
                image={item.imagen || '/src/assets/logos/Error404.png'}
                alt={`Imagen de ${item.nombre}`}
                className="w-full h-48 object-cover"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {`${item.nombre} ${item.apellido}`}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  DNI: {item.dni}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Puesto: {item.puesto}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Turno: {item.turno}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PersonalBD;
