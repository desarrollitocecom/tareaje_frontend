import React, { useEffect, useState } from 'react';
import CRUDTable from '../../Components/Table/CRUDTable';
import { Link, useNavigate } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import dayjs from 'dayjs';
import { formatDate, FormatoEnvioFecha } from '../../helpers/GeneralFunctions';
import useFetch from '../../Components/hooks/useFetch';
import { useSelector } from 'react-redux';
import CompareImages from '../../Components/Image/CompareImages';
import CustomSwal from '../../helpers/swalConfig';
import * as XLSX from 'xlsx-js-style';
import { Tooltip, IconButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

const AsistenciaPersonal = () => {
  const { getData } = useFetch()
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const [dataFormatted, setDataFormatted] = useState([]);
  const [ImagesData, setImagesData] = useState(null);
  const [OpenModal, setOpenModal] = useState(false)
  const [date, setDate] = useState(new Date());
  const [Count, setCount] = useState(0)

  const navigate = useNavigate();

  const handleRowClick = (event, row) => {
    const photo_id = row.notShow.photo_id
    const foto = row.notShow.foto

    if (photo_id === 'Asistencia manual') {
      CustomSwal.fire({
        icon: 'info',
        title: 'Asistencia manual no visible.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 4000
      })
      return
    }
    setImagesData({
      photo_id,
      foto
    });
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
      console.log(response);
      setCount(response.data.data.totalCount)
      const formattedData = response.data.data.asistencias.map((item) => ({
        id: item.id_asistencia,
        nombres: item.nombres === "undefined" ? '-' : item.nombres,
        apellidos: item.apellidos === "undefined" ? '-' : item.apellidos,
        dni: item.dni === "undefined" ? '-' : item.dni,
        turno: item.turno === "undefined" ? '-' : item.turno,
        fecha: item.fecha === "undefined" ? '-' : item.fecha,
        hora: item.hora === "undefined" ? '-' : item.hora,
        tipo: item.photo_id === 'Asistencia manual' ? '🔴' : '🟢',
        notShow: {
          photo_id: item.photo_id,
          foto: item.foto
        }
      }));
      setDataFormatted(formattedData);
    }).catch((error) => {
      console.log(error);
    }).finally(() => {
      setLoading(false);
    });
  };

  const exportToExcel = () => {
    getData(`${import.meta.env.VITE_APP_ENDPOINT}/asistencias/diaria/${FormatoEnvioFecha(date)}`, token).then((response) => {
      const data = response.data.data.asistencias.map((item) => ({
        'NOMBRES': item.nombres === "undefined" ? '-' : item.nombres,
        'APELLIDOS': item.apellidos === "undefined" ? '-' : item.apellidos,
        'DNI': item.dni === "undefined" ? '-' : item.dni,
        'TURNO': item.turno === "undefined" ? '-' : item.turno,
        'FECHA': item.fecha === "undefined" ? '-' : item.fecha,
        'HORA': item.hora === "undefined" ? '-' : item.hora,
        'TIPO': item.photo_id === 'Asistencia manual' ? 'Manual' : 'Automática'
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);

      worksheet['!cols'] = [
        { wch: 20 }, // NOMBRES
        { wch: 20 }, // APELLIDOS
        { wch: 15 }, // DNI
        { wch: 15 }, // TURNO
        { wch: 15 }, // FECHA
        { wch: 10 }, // HORA
        { wch: 15 }  // TIPO
      ];

      const range = XLSX.utils.decode_range(worksheet['!ref']);
      for (let row = range.s.r; row <= range.e.r; row++) {
        for (let col = range.s.c; col <= range.e.c; col++) {
          const address = XLSX.utils.encode_cell({ r: row, c: col });
          const cell = worksheet[address];

          if (cell) {
            cell.s = {
              font: { bold: row === 0, color: { rgb: row === 0 ? 'FFFFFF' : '000000' }, sz: 12 },
              alignment: { horizontal: 'center', vertical: 'center' },
              fill: row === 0 ? { fgColor: { rgb: '16a34a' } } : undefined,
              border: {
                top: { style: 'thin', color: { rgb: '000000' } },
                left: { style: 'thin', color: { rgb: '000000' } },
                bottom: { style: 'thin', color: { rgb: '000000' } },
                right: { style: 'thin', color: { rgb: '000000' } }
              }
            };
          }
        }
      }

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Asistencia');

      XLSX.writeFile(workbook, `Asistencia_${FormatoEnvioFecha(date)}.xlsx`);

    }).catch((error) => {
      CustomSwal.fire({
        icon: 'error',
        title: 'Error al exportar a Excel',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 4000
      });
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
            <div className="flex justify-center md:justify-end w-full md:col-span-1 lg:col-span-4">
            <Tooltip title="Descargar Excel" arrow>
                <IconButton
                  onClick={exportToExcel}
                  className="!bg-green-500 !text-white hover:!bg-green-600"
                >
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
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
            rowOnClick={handleRowClick}
            noDataText={`No hay asistencias registradas para la fecha ${formatDate(date)}.`}
            count={Count}
          />
        </div>
      </main>
      <CompareImages
        // imagen={ImagesData?.foto}
        // captura={ImagesData?.photo_id}
        imagen={"uploads/fotos/6f2af8e4-ed3d-4e1d-82e4-7f1fd4b1112f.jpg"}
        captura={'axxon/photo/0697C6F0-CA7E-EF11-892C-D4F5EF3DCC17'}
        open={OpenModal}
        handleClose={handleCloseModal}
      />
    </div>
  );
};

export default AsistenciaPersonal;
