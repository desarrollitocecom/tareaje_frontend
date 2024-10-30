import React, { useEffect, useState } from 'react';
import { Formik, Form } from "formik";
import useData from "../Components/Hooks/UseDB";
import axios from 'axios';
import CRUDTable from '../Components/Table/CRUDTable';
import { Link, useNavigate } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import FiltroSelect from "../Components/Filtroselect/Filtro";
import { TextField } from "@mui/material";

const AsistenciaPersonal = () => {
  const { cargos, turnos, subgerencias } = useData();
  const [loading, setLoading] = useState(false);
  const [dataFormatted, setDataFormatted] = useState([]);
  const navigate = useNavigate();
  const handlerowClick = (row) => {
    console.log("Row clicked:", row);
  }

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
            ASISTENCIA DEL PERSONAL
          </h1>
        </header>
      <main className='flex-1 bg-white shadow rounded-lg p-4 h-full overflow-hidden'>
        <div className='flex flex-col w-full h-full'>

      <Formik
        initialValues={{
          buscar: "",
          fecha: null,
          cargo: "",
          turno: "",
          subgerencias: ""
        }}
        onSubmit={(values) => {
          console.log("Valores del formulario:", values);
        }}
      >
        {({ handleChange, handleBlur, values, setFieldValue, errors, touched }) => (
          <Form className="flex flex-col text-nowrap">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4 text-sm">
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
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Seleccionar Fecha"
                    value={values.fecha}
                    slotProps={{ textField: { size: 'small' } }}
                    maxDate={dayjs()}
                    format="DD/MM/YYYY"
                    onChange={(value) => setFieldValue("fecha", value)}
                    
                    
                  />
                </LocalizationProvider>
              </div>

              {/* Seleccionar Subgerencia */}
              <div>
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
          
              
          </Form>
        )}
      </Formik>
      <div className="my-1"></div>

        <CRUDTable 
        data={dataFormatted} 
        loading={loading} 
        rowOnClick={handlerowClick}
        />
        </div>
      </main>
    </div>
  );
};

export default AsistenciaPersonal;
