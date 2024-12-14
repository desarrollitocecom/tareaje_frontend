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
import { Tooltip, IconButton, Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import CustomPopover from "../../Components/Popover/CustomPopover";
import FilterListIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import FiltroSelect from '../../Components/Filtroselect/Filtro';
import UseUrlParamsManager from '../../Components/hooks/UseUrlParamsManager';
import useFetchData from '../../Components/hooks/useFetchData';

const AsistenciaPersonal = () => {
  const { getData } = useFetch()
  const [DataSelects, setDataSelects] = useState([])
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const [dataFormatted, setDataFormatted] = useState([]);
  const [ImagesData, setImagesData] = useState(null);
  const [OpenModal, setOpenModal] = useState(false)
  const [date, setDate] = useState(new Date());
  const [Count, setCount] = useState(0)
  const { addParams, getParams, removeParams } = UseUrlParamsManager();
  const { fetchCargos, fetchTurnos, fetchSubgerencias, fetchRegimenLaboral, fetchSexos, fetchJurisdicciones } = useFetchData(token);
  const params = getParams();

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
    fetchData(date, location.search);
  }, [location.search, date]);

  const fetchData = (date, params) => {
    setLoading(true);
    getData(`${import.meta.env.VITE_APP_ENDPOINT}/asistencias/diaria/${FormatoEnvioFecha(date)}/${params || ''}`, token).then((response) => {
      setCount(response.data.data.totalCount)
      const formattedData = response.data.data.asistencias.map((item) => ({
        id: item.id,
        apellidos: item.empleado?.apellidos || '-',
        nombres: item.empleado?.nombres || '-',
        dni: item.empleado?.dni || '-',
        cargo: item.empleado?.cargo?.nombre || '-',
        turno: item.empleado?.turno?.nombre || '-',
        fecha: item.fecha || '-',
        hora: item.hora || '-',
        tipo: item.photo_id === 'Asistencia manual' ? '🔴' : '🟢',
        notShow: {
          photo_id: item.photo_id,
          foto: item.empleado?.foto || null,
        },
      }));
      setDataFormatted(formattedData);
    }).catch((error) => {
      console.log(error);
    }).finally(() => {
      setLoading(false);
    });
  };

  const exportToExcel = () => {
    const params = location.search;

    // Convertir los parámetros a un objeto
    const urlSearchParams = new URLSearchParams(params);

    // Quitar las propiedades 'page' y 'limit'
    urlSearchParams.delete('page');
    urlSearchParams.delete('limit');

    // Reconstruir el string de parámetros
    const updatedParams = `?${urlSearchParams.toString()}&page=0`;
    console.log(updatedParams);

    getData(`${import.meta.env.VITE_APP_ENDPOINT}/asistencias/diaria/${FormatoEnvioFecha(date)}${updatedParams}`, token).then((response) => {
      const data = response.data.data.asistencias.map((item) => ({
        'APELLIDOS': item.empleado?.apellidos || '-',
        'NOMBRES': item.empleado?.nombres || '-',
        'DNI': item.empleado?.dni || '-',
        'CARGO': item.empleado?.cargo?.nombre || '-',
        'TURNO': item.empleado?.turno?.nombre || '-',
        'FECHA': item.fecha || '-',
        'HORA': item.hora || '-',
        'TIPO': item.photo_id === 'Asistencia manual' ? 'Manual' : 'Automática',
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
            <div className="flex gap-5 items-center">
              <div>
                <DatePicker
                  className='!min-w-max'
                  label="Seleccionar Fecha"
                  value={dayjs(date)}
                  slotProps={{ textField: { size: 'small' } }}
                  maxDate={dayjs()}
                  format="DD/MM/YYYY"
                  onChange={(value) => setDate(value)}
                />
              </div>
              <div>
                <CustomPopover
                  CustomIcon={FilterListIcon}
                  CustomIconClose={FilterAltOffIcon}
                  label={"Filtro Personal"}
                >
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
                    </div>

                    {/* Botón para limpiar filtros */}
                    <div className="flex justify-end mt-6">
                      <Button
                        className="!capitalize"
                        onClick={() => {
                          removeParams();
                        }}
                        variant="outlined"
                        color="error"
                        size="small"
                      >
                        Limpiar filtros
                      </Button>
                    </div>
                  </div>
                </CustomPopover>
              </div>
            </div>
            <div className="flex justify-center md:justify-end w-full md:col-span-1 lg:col-span-4">
              {Count > 0 && (
                <Tooltip title="Descargar Excel" arrow>
                  <IconButton
                    onClick={exportToExcel}
                    className="!bg-green-500 !text-white hover:!bg-green-600"
                  >
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
              )}
            </div>
          </div>

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
