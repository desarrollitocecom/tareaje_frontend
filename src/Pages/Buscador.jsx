import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Card, CardActionArea, CardContent, Typography, Button, Popover, Slider } from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import FilterListIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import FiltroSelect from '../Components/Filtroselect/Filtro';
import SearchInput from '../Components/Inputs/SearchInput';
import UseUrlParamsManager from '../Components/hooks/UseUrlParamsManager';
import useFetch from '../Components/hooks/useFetch';
import { useSelector } from 'react-redux';
import ImageComponent from '../Components/Image/ImageComponent';
import CustomTablePagination from './Pagination/TablePagination';
import useFetchData from '../Components/hooks/useFetchData';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { ESTADOS } from '../helpers/Constants';

const PersonalBD = () => {
  const [DataSelects, setDataSelects] = useState([])
  const navigate = useNavigate();
  const location = useLocation()
  const url = new URLSearchParams(location.search);
  const { addParams, getParams, removeParams } = UseUrlParamsManager();
  const { token } = useSelector((state) => state.auth);
  const { fetchCargos, fetchTurnos, fetchSubgerencias, fetchRegimenLaboral, fetchSexos, fetchJurisdicciones } = useFetchData(token);
  const { getData } = useFetch()
  const params = getParams();
  const [anchorEl, setAnchorEl] = useState(null);
  const [Data, setData] = useState([])
  const [count, setCount] = useState(0);
  const [HijosRange, setHijosRange] = useState([url.get('hijosMin') || 0, url.get('hijosMax') || 30])
  const [EdadRange, setEdadRange] = useState([url.get('edadMin') || 0, url.get('edadMax') || 100])
  const timeoutRef = useRef(null);

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


  useEffect(() => {
    loadFiltersData();
  }, [])

  const loadFiltersData = async () => {
    try {
      const [subgerenciasData, turnosData, cargosData, regimenLaboralData, sexosData, JurisdiccionesData] = await Promise.all([
        fetchSubgerencias(),
        fetchTurnos(),
        fetchCargos(),
        fetchRegimenLaboral(),
        fetchSexos(),
        fetchJurisdicciones()
      ]);

      setDataSelects({
        subgerencias: mapToSelectOptions(subgerenciasData?.data),
        turnos: mapToSelectOptions(turnosData?.data),
        cargos: mapToSelectOptions(cargosData?.data),
        regimenLaboral: mapToSelectOptions(regimenLaboralData?.data),
        sexos: mapToSelectOptions(sexosData?.data),
        jurisdicciones: mapToSelectOptions(JurisdiccionesData?.data),
      });

    } catch (error) {
      console.error('Error al cargar los datos de filtros:', error);
    }
  };

  const mapToSelectOptions = (data) => {
    if (!data) return []

    return data.map((item) => ({ value: item.id, label: item.nombre }))
  }

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
          <CloseRoundedIcon className='absolute top-5 right-5 cursor-pointer' onClick={() => setAnchorEl(null)} />
          <div className="p-6">
            <h1 className="text-xl font-bold text-gray-700 pb-4">Filtros</h1>
            <div className="flex flex-wrap justify-center max-w-[500px] max-h-[500px] overflow-y-auto overflow-x-hidden">
              {/* Subgerencia */}
              <div className="w-full sm:w-1/2 md:w-1/2 px-2 py-2">
                <label className="text-sm font-semibold text-gray-600" htmlFor="edad-label">Subgerencia</label>
                <FiltroSelect
                  name="subgerencias"
                  placeholder={'Seleccione una subgerencia'}
                  onChange={(e) => addParams({ subgerencia: e.target.value })}
                  value={params.subgerencia || ''}
                  options={DataSelects.subgerencias}
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
                  options={DataSelects.cargos}
                />
              </div>

              {/* Regimen */}
              <div className="w-full sm:w-1/2 md:w-1/2 px-2 py-2">
                <label className="text-sm font-semibold text-gray-600" htmlFor="regimen-label">Regimen</label>
                <FiltroSelect
                  name="regimen"
                  placeholder={'Seleccione un regimen'}
                  onChange={(e) => addParams({ regimen: e.target.value })}
                  value={params.regimen || ''}
                  options={DataSelects.regimenLaboral}
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
                  options={DataSelects.turnos}
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
                  options={DataSelects.sexos}
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
                  options={DataSelects.jurisdicciones}
                />
              </div>

              {/* Jurisdicción */}
              <div className="w-full sm:w-1/2 md:w-1/2 px-2 py-2">
                <label className="text-sm font-semibold text-gray-600" htmlFor="jurisdiccion-label">Estado</label>
                <FiltroSelect
                  name="Jurisdicciones"
                  placeholder={'Seleccione un estado'}
                  onChange={(e) => addParams({ state: e.target.value })}
                  value={params.state || ''}
                  options={ESTADOS}
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
                    onChange={(e, value) => {
                      setHijosRange(value)
                      if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                      }

                      timeoutRef.current = setTimeout(() => {
                        addParams({ hijosMin: value[0], hijosMax: value[1] });
                      }, 800);
                    }}
                    value={HijosRange}
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
                    onChange={(e, value) => {
                      setEdadRange(value)
                      if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                      }

                      timeoutRef.current = setTimeout(() => {
                        addParams({ edadMin: value[0], edadMax: value[1] });
                      }, 800);
                    }}
                    value={EdadRange}
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
                onClick={() => {
                  removeParams();
                  setHijosRange([0, 30]);
                  setEdadRange([0, 100]);
                }}
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
      <main className='flex-1 flex flex-col bg-white shadow rounded-lg p-4 h-full overflow-hidden mt-4'>
        <div className='flex flex-1 overflow-auto pr-1'>
          {Data.length > 0 ? (
            <div className='gap-4 w-full grid grid-cols-[repeat(auto-fill,_minmax(230px,_1fr))] justify-start'>

              {Data.map((item) => (
                <div className='w-full flex justify-center' key={item.id}>
                  <div className='w-full max-w-[300px]'>
                    <Link to={`/buscar/${item.id}`}>
                      <Card sx={{ width: '100%' }} className='border !rounded-lg'>
                        <CardActionArea >
                          <ImageComponent
                            className="w-full aspect-[5/7] object-cover"
                            path={item.foto}
                            alt={`Imagen de ${item.nombres}`}
                          />
                          <CardContent className={`absolute bottom-0 !p-2 !pt-8 w-full bg-card-empleado`}>
                            <Typography className='overflow-hidden !text-ellipsis text-nowrap !font-[600] text-neutral-100' variant="h5" component="div" style={{ fontSizeAdjust: "0.5",marginBottom:"-8px"}}>
                              {`${item.apellidos}`}
                            </Typography>
                            <Typography className='overflow-hidden !text-ellipsis text-nowrap text-neutral-100' variant="h5" component="div" style={{ fontSizeAdjust: "0.5" }}>
                              {`${item.nombres}`}
                            </Typography>
                            <Typography className='overflow-hidden !text-ellipsis text-nowrap text-neutral-200' variant="body2" style={{ fontSizeAdjust: "0.45",marginBottom:"-4px" }}>
                              DNI: {item.dni}
                            </Typography>
                            <Typography className='overflow-hidden !text-ellipsis text-nowrap text-neutral-200' variant="body2" style={{ fontSizeAdjust: "0.45",marginBottom:"-2px" }}>
                              subgerencia: {item.subgerencia.nombre}
                            </Typography>
                            <Typography className='overflow-hidden !text-ellipsis text-nowrap text-neutral-200' variant="body2" style={{ fontSizeAdjust: "0.45",marginBottom:"-2px" }}>
                              Turno: {item.turno.nombre}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Link>
                  </div>
                </div>))}
            </div>
          ) :
            (
              <div className='flex justify-center items-center w-full h-full'>
                <h1 className='text-sm font-bold'>No se encontraron resultados</h1>
              </div>
            )}
        </div>
        <CustomTablePagination count={count} />
      </main>
    </div>
  );
};

export default PersonalBD;
