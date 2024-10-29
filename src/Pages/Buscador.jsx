import React from 'react';
import { Formik, Form } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Card, CardActionArea, CardMedia, CardContent, Typography } from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import useData from '../Components/Hooks/UseDB';
import FiltroSelect from '../Components/Filtroselect/Filtro'; 

const PersonalBD = () => {
  const { data, cargos, turnos, sexos, edades, regimens, cants_hijos, Jurisdicciones } = useData();
  const navigate = useNavigate();

  return (
    <div className="w-full bg-gray-100 px-6 py-8 h-full flex flex-col overflow-auto">
      <header className="text-white bg-green-700 py-4 px-3 mb-6 w-full rounded-lg flex justify-center relative">
        <Link onClick={() => navigate(-1)} className="flex items-center gap-1">
          <ArrowBackIosNewRoundedIcon
            className="!size-5 md:!size-6 mt-[0.1rem] absolute left-4"
          />
        </Link>
        <h1 className="md:text-2xl lg:text-4xl font-bold text-center">
          BUSCADOR
        </h1>
      </header>
      <Formik
        initialValues={{ buscar: '', cargo: '', turnos: '', sexos: '', edades: '', regimens: '', cants_hijos: '', Jurisdicciones: '' }}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {({ handleChange, handleBlur, values, errors, touched }) => (
          <Form>
            <div className="text-nowrap mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="w-full">
                  <div className="grid grid-cols-1 md:grid-cols-11 gap-4">
                    <div className='md:col-span-5'>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Buscar"
                        name="buscar"
                        size="small"
                        className="bg-white grid-cols-2"
                        value={values.buscar}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </div>
                    <div className='md:col-span-3'>
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
                    <div className='md:col-span-3'>
                      <FiltroSelect
                        label="Turno"
                        name="turnos"
                        value={values.turnos}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        options={turnos}
                        error={errors.turnos}
                        touched={touched.turnos}
                      />
                    </div>
                    <div className='md:col-span-2'>
                      <FiltroSelect
                        label="Sexo"
                        name="sexos"
                        value={values.sexos}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        options={sexos}
                        error={errors.sexos}
                        touched={touched.sexos}
                      />
                    </div>
                    <div className='md:col-span-2'>
                      <FiltroSelect
                        label="Edad"
                        name="edades"
                        value={values.edades}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        options={edades}
                        error={errors.edades}
                        touched={touched.edades}
                      />
                    </div>
                    <div className='md:col-span-2'>
                      <FiltroSelect
                        label="Regimen"
                        name="regimens"
                        value={values.regimens}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        options={regimens}
                        error={errors.regimens}
                        touched={touched.regimens}
                      />
                    </div>
                    <div className='md:col-span-2'>
                      <FiltroSelect
                        label="Cantidad de Hijos"
                        name="cants_hijos"
                        value={values.cants_hijos}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        options={cants_hijos}
                        error={errors.cants_hijos}
                        touched={touched.cants_hijos}
                      />
                    </div>
                    <div className='md:col-span-3'>
                      <FiltroSelect
                        label="Jurisdicción"
                        name="Jurisdicciones"
                        value={values.Jurisdicciones}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        options={Jurisdicciones}
                        error={errors.Jurisdicciones}
                        touched={touched.Jurisdicciones}
                      />
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
            <Card sx={{ maxWidth: 345 }} className="w-full sm:w-72">
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
