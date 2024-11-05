import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Card, CardActionArea, CardMedia, CardContent, Typography, Avatar, IconButton } from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import FilterListIcon from '@mui/icons-material/FilterAlt';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import useData from '../Components/Hooks/UseDB';
import FiltroSelect from '../Components/Filtroselect/Filtro';

const PersonalBD = () => {
  const { data, cargos, turnos, sexos, edades, regimens, cants_hijos, Jurisdicciones, subgerencias } = useData();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="w-full bg-gray-100 p-4 h-full flex flex-col overflow-auto">
      <header className="text-white bg-green-700 py-4 px-3 mb-6 w-full rounded-lg flex justify-center relative">
        <Link onClick={() => navigate(-1)} className="flex items-center gap-1">
          <ArrowBackIosNewRoundedIcon className="!size-5 md:!size-6 mt-[0.1rem] absolute left-4" />
        </Link>
        <h1 className="md:text-2xl lg:text-4xl font-bold text-center">
          BUSCADOR
        </h1>
      </header>
      <IconButton style={{ justifyContent: 'left' }}
        onClick={() => setShowFilters(!showFilters)}
        className="md:hidden text-white flex items-left "
      >
        {showFilters ? <FilterListIcon /> : <FilterListOffIcon />}
        <h2 className='font-bold text-black'>Filtros</h2>
      </IconButton>
      {showFilters && (
        <Formik
          initialValues={{ buscar: '', cargo: '', turnos: '', sexos: '', edades: '', regimens: '', cants_hijos: '', Jurisdicciones: '', subgerencias: '' }}
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
                      <div className='md:col-span-1'>
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
                          label="Subgerencia"
                          name="subgerencias"
                          value={values.subgerencias}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          options={subgerencias}
                          error={errors.subgerencias}
                          touched={touched.subgerencias}
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
                      <div className='md:col-span-2'>
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
      )}

      <div className="flex flex-wrap flex-col md:flex-row justify-center gap-4 p-4">
        {data.map((item) => (
          <Link to={`/buscar/${item.id}`} key={item.id}>
            <Card sx={{ maxWidth: 345 }} className="hidden md:flex w-full sm:w-72">
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="140"
                  image={item.imagen || '/src/assets/logos/Error404.png'}
                  alt={`Imagen de ${item.nombre}`}
                  className="w-full h-48 object-cover"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div" style={{ margin: "0" }}>
                    {`${item.apellido}`}
                  </Typography>
                  <Typography gutterBottom variant="h5" component="div">
                    {`${item.nombre}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" style={{ fontSizeAdjust: "0.6" }}>
                    DNI: {item.dni}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" style={{ fontSizeAdjust: "0.6" }}>
                    Puesto: {item.puesto}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" style={{ fontSizeAdjust: "0.6" }}>
                    Turno: {item.turno}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
            <Card className="flex flex-wrap md:hidden w-full ">
              <CardActionArea style={{ display: "flex", flexDirection: "row" }}>
                <Avatar
                  alt={`${item.apellido} ${item.nombre}`}
                  src={item.imagen || '/src/assets/logos/Error404.png'}
                  sx={{ width: 120, height: 120, marginRight: 2 }}

                />
                <CardContent sx={{ flex: '1 0 auto' }}>
                  <div className="sm:flex sm:flex-col sm:items-start">

                    <Typography variant="h6" component="div" className="sm:text-xl">
                      {item.apellido}
                    </Typography>
                    <Typography variant="h6" component="div" className="text-lg sm:ml-0">
                      {item.nombre}
                    </Typography>
                  </div>
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
