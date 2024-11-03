import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import { Box, Button, TextField, Paper } from '@mui/material';
import useData from "../Components/Hooks/UseDB";
import axios from 'axios';
import CRUDTable from '../Components/Table/CRUDTable';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { Link, useNavigate } from "react-router-dom";
import FiltroSelect from '../Components/Filtroselect/Filtro';

const PersonalBD = () => {
  const { data, cargos, turnos, subgerencias } = useData();
  const [loading, setLoading] = useState(false);
  const [dataFormatted, setDataFormatted] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/DataEjemplo.json`);
      const formattedData = response.data.data.map((item) => ({
        id: item.member,
        nombres: item.nombres,
        apellidos: item.apellidos,
        cargo: item.cargo,
        telefono: item.telefono,
      }));
      setDataFormatted(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='h-full flex flex-col w-full bg-gray-100 p-4'>
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
      <main className='flex-1 bg-white shadow rounded-lg p-4 h-full overflow-hidden'>
        <div className='flex flex-col w-full h-full'>

          <Formik 
            initialValues={{ buscar: '', cargo: '', turnos: '', subgerencias: '' }}      >
            {({ handleChange, handleBlur, values, errors, touched }) => (
              <Form>
                <div className="text-nowrap mb-4">
                  <div elevation={3} sx={{ padding: 3, borderRadius: 2 }} className="flex flex-col lg:flex-row gap-4">

                    <div className="w-full">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                          <FiltroSelect
                            label="Subgerencia"
                            name="subgerencias"
                            value={values.subgerencias || ''}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            options={subgerencias}
                            error={errors.subgerencias}
                            touched={touched.subgerencias}
                          />
                        </div>
                        <div>
                          <FiltroSelect
                            label="Cargo"
                            name="cargos"
                            value={values.cargos || ''}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            options={cargos}
                            error={errors.cargos}
                            touched={touched.cargos}
                          />
                        </div>
                        <div>
                          <FiltroSelect
                            label="Turno"
                            name="turnos"
                            value={values.turnos || ''}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            options={turnos}
                            error={errors.turnos}
                            touched={touched.turnos}
                          />
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
          
          <div className="my-1"></div>

          <CRUDTable data={dataFormatted} loading={loading} />
          
        </div>
      </main>
    </div>
  );
};

export default PersonalBD;
