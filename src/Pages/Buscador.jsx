import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { TextField, Card, CardActionArea, CardMedia, CardContent, Typography, Avatar, IconButton, Button, Collapse, InputBase, Popover, Grid, FormControl, InputLabel, Select, Slider } from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import FilterListIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import useData from '../Components/Hooks/UseDB';
import FiltroSelect from '../Components/Filtroselect/Filtro';
import SearchInput from '../Components/Inputs/SearchInput';
import UseUrlParamsManager from '../Components/hooks/UseUrlParamsManager';
import ErrImg from "../assets/logos/notFoundImage.webp"
import { MenuItem } from 'react-pro-sidebar';
import useFetch from '../Components/hooks/useFetch';
import { useSelector } from 'react-redux';

const PersonalBD = () => {
  const { data, cargos, turnos, sexos, edades, regimens, cants_hijos, Jurisdicciones, subgerencias } = useData();
  const navigate = useNavigate();
  const location = useLocation()
  const { addParams, getParams, removeParams } = UseUrlParamsManager();
  const { token } = useSelector((state) => state.auth);
  const { getData } = useFetch()
  const params = getParams();
  const [anchorEl, setAnchorEl] = useState(null);
  const [Data, setData] = useState([])
  const [count, setCount] = useState(0);


  useEffect(() => {
    fetchEmpleados(location.search || '')
  }, [location.search])

  const fetchEmpleados = async (urlParams) => {
    getData(`${import.meta.env.VITE_APP_ENDPOINT}/empleados/${urlParams}`, token).then((response) => {
      setCount(response.data.data.totalCount)
      setData(response.data.data.data)
    }).catch((error) => {
      console.error(error);
    })
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

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
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className='flex justify-start w-full'>
          <Button
            onClick={handleClick}
            className="flex items-center gap-1 !capitalize !text-black"
          >
            {open ? <FilterAltOffIcon sx={{ fontSize: '1.2rem' }} /> : <FilterListIcon sx={{ fontSize: '1.2rem' }} />}
            Filtros
          </Button>
        </div>
        <SearchInput />
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <div className="p-6">
            <h1 className="text-xl font-bold text-gray-700 ">Filtros</h1>
            <div className="flex flex-wrap justify-center max-w-[500px] mx-auto">
              {/* Subgerencia */}
              <div className="w-full sm:w-1/2 md:w-1/2 px-2 py-2">
                <label className="text-sm font-semibold text-gray-600" htmlFor="edad-label">Subgerencia</label>
                <FiltroSelect
                  name="subgerencias"
                  placeholder={'Seleccione una subgerencia'}
                  onChange={(e) => addParams({ subgerencia: e.target.value })}
                  value={params.subgerencia || ''}
                  options={subgerencias}
                />
              </div>

              {/* Cargo */}
              <div className="w-full sm:w-1/2 md:w-1/2 px-2 py-2">
                <label className="text-sm font-semibold text-gray-600" htmlFor="cargo-label">Cargo</label>
                <FiltroSelect
                  name="cargo"
                  placeholder={'Seleccione un cargo'}
                  onChange={(e) => addParams({ cargo: e.target.value })}
                  value={params.cargo || ''}
                  options={cargos}
                />
              </div>

              {/* Regimen */}
              <div className="w-full sm:w-1/2 md:w-1/2 px-2 py-2">
                <label className="text-sm font-semibold text-gray-600" htmlFor="regimen-label">Regimen</label>
                <FiltroSelect
                  name="regimens"
                  placeholder={'Seleccione un regimen'}
                  onChange={(e) => addParams({ regimen: e.target.value })}
                  value={params.regimen || ''}
                  options={regimens}
                />
              </div>

              {/* Turno */}
              <div className="w-full sm:w-1/2 md:w-1/2 px-2 py-2">
                <label className="text-sm font-semibold text-gray-600" htmlFor="turno-label">Turno</label>
                <FiltroSelect
                  name="turnos"
                  placeholder={'Seleccione un turno'}
                  onChange={(e) => addParams({ turno: e.target.value })}
                  value={params.turno || ''}
                  options={turnos}
                />
              </div>

              {/* Sexo */}
              <div className="w-full sm:w-1/2 md:w-1/2 px-2 py-2">
                <label className="text-sm font-semibold text-gray-600" htmlFor="sexo-label">Sexo</label>
                <FiltroSelect
                  name="sexos"
                  placeholder={'Seleccione un sexo'}
                  onChange={(e) => addParams({ sexo: e.target.value })}
                  value={params.sexo || ''}
                  options={sexos}
                />
              </div>



              {/* Jurisdicción */}
              <div className="w-full sm:w-1/2 md:w-1/2 px-2 py-2">
                <label className="text-sm font-semibold text-gray-600" htmlFor="jurisdiccion-label">Jurisdicción</label>
                <FiltroSelect
                  name="Jurisdicciones"
                  placeholder={'Seleccione una jurisdicción'}
                  onChange={(e) => addParams({ jurisdiccion: e.target.value })}
                  value={params.jurisdiccion || ''}
                  options={Jurisdicciones}
                />
              </div>

              {/* Hijos */}
              <div className="w-full px-2 py-2">
                <label className="text-sm font-semibold text-gray-600" htmlFor="edad-label">Hijos</label>
                <div className="pt-2 px-2">
                  <Slider
                    className="min-w-[12rem]"
                    getAriaLabel={() => 'Hijos'}
                    defaultValue={[0, 30]}
                    valueLabelDisplay="auto"
                    onChange={(e, value) => addParams({ hijos: `${value[0]}-${value[1]}` })}
                    value={[params.hijos?.split('-')[0] || 0, params.hijos?.split('-')[1] || 30]}
                    max={30}
                    min={0}
                    marks={[
                      { value: 0, label: '0' },
                      { value: 30, label: '30' },
                    ]}
                  />
                </div>
              </div>

              {/* Rango de Edad */}
              <div className="w-full px-2 py-2">
                <label className="text-sm font-semibold text-gray-600" htmlFor="edad-label">Edad</label>
                <div className="pt-2 px-2">
                  <Slider
                    className="min-w-[12rem]"
                    getAriaLabel={() => 'Edad'}
                    defaultValue={[0, 100]}
                    valueLabelDisplay="auto"
                    onChange={(e, value) => addParams({ edad: `${value[0]}-${value[1]}` })}
                    value={[params.edad?.split('-')[0] || 0, params.edad?.split('-')[1] || 100]}
                    max={100}
                    min={0}
                    marks={[
                      { value: 0, label: '0' },
                      { value: 100, label: '100' },
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* Botón para limpiar filtros */}
            <div className="flex justify-end mt-6">
              <Button
                className="!capitalize"
                onClick={removeParams}
                variant="outlined"
                color="error"
                size="small"
              >
                Limpiar filtros
              </Button>
            </div>
          </div>

        </Popover>
      </div>
      <div className="grid gap-4 py-4 w-full"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          justifyContent: 'start',
        }}>
        {Data.map((item) => (
          <Link to={`/buscar/${item.id}`} key={item.id}>
            <Card sx={{ width: '100%' }}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="140"
                  image={item.imagen || ErrImg}
                  alt={`Imagen de ${item.nombres}`}
                  className="w-full h-48 object-cover"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div" style={{ margin: "0" }}>
                    {`${item.apellidos}`}
                  </Typography>
                  <Typography gutterBottom variant="h5" component="div">
                    {`${item.nombres}`}
                  </Typography>
                  <Typography className='overflow-hidden !text-ellipsis text-nowrap' variant="body2" color="text.secondary" style={{ fontSizeAdjust: "0.6" }}>
                    DNI: {item.dni}
                  </Typography>
                  <Typography className='overflow-hidden !text-ellipsis text-nowrap' variant="body2" color="text.secondary" style={{ fontSizeAdjust: "0.6" }}>
                    Puesto: {item.subgerencia.nombre}
                  </Typography>
                  <Typography className='overflow-hidden !text-ellipsis text-nowrap' variant="body2" color="text.secondary" style={{ fontSizeAdjust: "0.6" }}>
                    Turno: {item.turno.nombre}
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
