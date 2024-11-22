import React, { useEffect, useRef, useState } from 'react';
import { Formik, Form } from 'formik';
import { Box, Button, TextField, Paper } from '@mui/material';
import useData from "../Components/Hooks/UseDB";
import CRUDTable from '../Components/Table/CRUDTable';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { Link, useNavigate } from "react-router-dom";
import useFetch from '../Components/hooks/useFetch';
import { useSelector } from 'react-redux';
import FiltroSelect from '../Components/Filtroselect/Filtro';
import UseUrlParamsManager from '../Components/hooks/UseUrlParamsManager';
import useFetchData from '../Components/hooks/useFetchData';

const PersonalBD = () => {
  const { token } = useSelector((state) => state.auth);
  const { getData } = useFetch();
  const { fetchCargos, fetchTurnos, fetchSubgerencias } = useFetchData(token);

  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  const { addParams, getParams, removeParams } = UseUrlParamsManager();
  const params = getParams();

  const [loading, setLoading] = useState(false);
  const [dataFormatted, setDataFormatted] = useState([]);
  const [update, setUpdate] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [count, setCount] = useState(0);
  const [isDisabled] = useState(false); 


  // Estados para las opciones de filtros
  const [subgerencias, setSubgerencias] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [cargos, setCargos] = useState([]);


  // Carga de datos inicial
  useEffect(() => {
    loadFiltersData();
    fetchData(location.search || undefined);
  }, [location.search, update]);

  const loadFiltersData = async () => {
    try {
      const [subgerenciasData, turnosData, cargosData] = await Promise.all([
        fetchSubgerencias(),
        fetchTurnos(),
        fetchCargos(),
      ]);

      
      setSubgerencias(subgerenciasData.data || []);
      setTurnos(turnosData.data || []);
      setCargos(cargosData.data || []);
    } catch (error) {
      console.error('Error al cargar los datos de filtros:', error);
    }
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {

      addParams({ search: value.trim() });
    }, 800);
  };

  const refreshData = () => {
    setUpdate((prev) => !prev);
  };

  const fetchData = async (url) => {
    setLoading(true);
    const urlParams = url || ''
    try {
      const response = await getData(`${import.meta.env.VITE_APP_ENDPOINT}/empleados/${urlParams}`, token);
      setCount(response.data.data.totalCount);
      const formattedData = response.data.data.data.map((item) => ({
        id: item.id,
        nombres: item.nombres,
        apellidos: item.apellidos,
        subgerencia: item.subgerencia?.nombre || 'Sin Subgerencia',
        cargo: item.cargo?.nombre || 'Sin Cargo',
         turno: item.turno?.nombre || 'Sin Turno',
        telefono: item.celular,
      }));
      setDataFormatted(formattedData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col w-full bg-gray-100 p-4">

      <header className="text-white bg-green-700 py-4 px-3 mb-6 w-full rounded-lg flex justify-center relative">
        <Link onClick={() => navigate(-1)} className="flex items-center gap-1">
          <ArrowBackIosNewRoundedIcon className="!size-5 md:!size-6 mt-[0.1rem] absolute left-4" />
        </Link>
        <h1 className="md:text-2xl lg:text-4xl font-bold text-center">
          BASE DE DATOS DEL PERSONAL
        </h1>
      </header>

      <main className="flex-1 bg-white shadow rounded-lg p-6 h-full overflow-hidden">
        <div className="flex flex-col w-full h-full space-y-6">

          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm md:text-base">
              Total de filas: <span id="rowCount" className="font-bold">{count || 0}</span>
            </span>
          </div>

          <Formik
            initialValues={{ buscar: '', cargo: '', turnos: '', subgerencias: '' }}
          >
            {({ handleChange, handleBlur, values, errors, touched }) => (
              <Form className="space-y-4">
                {/* Filtros */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Box>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Buscar"
                      name="buscar"
                      size="small"
                      className="bg-white"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      onBlur={handleBlur}
                    />
                  </Box>
                  <FiltroSelect
                    label="Subgerencia"
                    name="subgerencias"
                    value={params.subgerencia || ''}
                    onChange={(e) => addParams({ subgerencia: e.target.value })}
                    onBlur={handleBlur}
                    options={subgerencias.map((item) => ({ value: item.id, label: item.nombre }))}
                    error={errors.subgerencias}
                    touched={touched.subgerencias}
                    disabled={isDisabled}
                    
                  />
                  <FiltroSelect
                    label="Cargo"
                    name="cargos"
                    value={params.cargo || ''}
                    onChange={(e) => addParams({ cargo: e.target.value })}
                    onBlur={handleBlur}
                    options={cargos.map((item) => ({ value: item.id, label: item.nombre }))}
                    error={errors.cargo}
                    touched={touched.cargo}
                    disabled={isDisabled}
                    
                  />
                  <FiltroSelect
                    label="Turno"
                    name="turnos"
                    value={params.turno || ''}
                    onChange={(e) => addParams({ turno: e.target.value })}
                    onBlur={handleBlur}
                    options={turnos.map((item) => ({ value: item.id, label: item.nombre }))}
                    error={errors.turnos}
                    touched={touched.turnos}
                    disabled={isDisabled}
                    
                  />
                </div>

                {/* Botones */}
                <div className="flex flex-wrap justify-between items-center gap-4">
                  <div className="flex gap-4">
                    <Button
                      variant="contained"
                      color="primary"
                      type="button"
                      size="small"
                      disabled={isDisabled}
                      
                    >
                      Descargar Excel
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      type="button"
                      size="small"
                      disabled={isDisabled}
                      
                    >
                      Importar Excel
                    </Button>
                  </div>
                  <Button
                    className="!capitalize"
                    onClick={removeParams}
                    variant="outlined"
                    color="error"
                    size="small"
                    disabled={isDisabled}
                   
                  >
                    Limpiar filtros
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
          
          <CRUDTable
            data={dataFormatted}
            loading={loading}
            count={count}
          />
        </div>
      </main>
    </div>
  );
};

export default PersonalBD;
