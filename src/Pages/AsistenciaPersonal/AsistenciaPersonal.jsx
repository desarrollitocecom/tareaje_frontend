import React, { useEffect, useState } from 'react';
import { Formik, Form } from "formik";
import axios from 'axios';
import CRUDTable from '../../Components/Table/CRUDTable';
import { Link, useNavigate } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import FiltroSelect from "../../Components/Filtroselect/Filtro";
import { TextField } from "@mui/material";
import dayjs from 'dayjs';
import ZoomImage from '../../Components/Image/zoomImages';
import CompareImages from '../../Components/Image/CompareImages';
import { formatDate, FormatoEnvioFecha } from '../../helpers/GeneralFunctions';
import useFetch from '../../Components/hooks/useFetch';
import { useSelector } from 'react-redux';

const AsistenciaPersonal = () => {
  const { getData } = useFetch()
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const [dataFormatted, setDataFormatted] = useState([]);
  const [ImagesData, setImagesData] = useState(null);
  const [OpenModal, setOpenModal] = useState(false)
  const [date, setDate] = useState(new Date());

  const navigate = useNavigate();

  const handlerowClick = (event, row) => {
    const item = data.find((item) => item.id === row.id)
    setImagesData(item);
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    setTimeout(() => {
      setImagesData(null)
    }, 500);
  }

  useEffect(() => {
    fetchData(date);
  }, [date]);

  const fetchData = (date) => {
    setLoading(true);
    getData(`${import.meta.env.VITE_APP_ENDPOINT}/asistencias/diaria/${FormatoEnvioFecha(date)}`, token).then((response) => {
      setDataFormatted(response.data.data);
    }).catch((error) => {
      console.log(error);
    }).finally(() => {
      setLoading(false);
    });
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
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4 text-sm'>
            <div className="flex flex-col">
              <DatePicker
                label="Seleccionar Fecha"
                value={dayjs(date)}
                slotProps={{ textField: { size: 'small' } }}
                maxDate={dayjs()}
                format="DD/MM/YYYY"
                onChange={(value) => setDate(value)}
              />
            </div>
          </div>
          {/* <Formik
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

                
                  <div className="flex flex-col">
                    <DatePicker
                      label="Seleccionar Fecha"
                      value={values.fecha}
                      slotProps={{ textField: { size: 'small' } }}
                      maxDate={dayjs()}
                      format="DD/MM/YYYY"
                      onChange={(value) => setFieldValue("fecha", value)}


                    />
                  </div>

                
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

              


              </Form>
            )}
          </Formik> */}
          <div className="my-1"></div>

          <CRUDTable
            data={dataFormatted}
            loading={loading}
            rowOnClick={handlerowClick}
            noDataText={`No hay asistencias registradas para la fecha ${formatDate(date)}.`}
          />
        </div>
      </main>
      {ImagesData && (
        <CompareImages
          imagen={ImagesData.imagen}
          captura={ImagesData.captura}
          open={OpenModal}
          handleClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default AsistenciaPersonal;
