import React, { useEffect, useRef, useState } from 'react';
import { Button, Popover, Tooltip, IconButton } from '@mui/material';
import CRUDTable from '../Components/Table/CRUDTable';
import FilterListIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { Link, useNavigate } from "react-router-dom";
import useFetch from '../Components/hooks/useFetch';
import { useSelector } from 'react-redux';
import FiltroSelect from '../Components/Filtroselect/Filtro';
import UseUrlParamsManager from '../Components/hooks/UseUrlParamsManager';
import useFetchData from '../Components/hooks/useFetchData';
import SearchInput from '../Components/Inputs/SearchInput';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import * as XLSX from 'xlsx-js-style';
import CustomSwal from '../helpers/swalConfig';
import ImageZoom from '../Components/Image/ImageZoom';

const PersonalBD = () => {

  const [DataSelects, setDataSelects] = useState([])
  const [anchorEl, setAnchorEl] = useState(null);
  const { token } = useSelector((state) => state.auth);
  const { getData } = useFetch();
  const { fetchCargos, fetchTurnos, fetchSubgerencias } = useFetchData(token);
  const [imageZoomOpen, setImageZoomOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');


  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  const { addParams, getParams, removeParams } = UseUrlParamsManager();
  const params = getParams();

  const [loading, setLoading] = useState(false);
  const [dataFormatted, setDataFormatted] = useState([]);
  const [count, setCount] = useState(0);
  const [isDisabled] = useState(false);


  // Carga de datos inicial
  useEffect(() => {
    loadFiltersData();
    fetchData(location.search || undefined);
  }, [location.search]);

  const fetchData = async (url) => {
    setLoading(true);
    const urlParams = url || ''
    try {
      const response = await getData(`${import.meta.env.VITE_APP_ENDPOINT}/empleados/${urlParams}`, token, true);
      setCount(response.data.data.totalCount);
      const formattedData = response.data.data.data.map((item) => ({
        id: item.id,
        apellidos: item.apellidos === "undefined" ? '-' : item.apellidos,
        nombres: item.nombres === "undefined" ? '-' : item.nombres,
        subgerencia: item.subgerencia?.nombre === "undefined" ? '-' : item.subgerencia?.nombre,
        cargo: item.cargo?.nombre === "undefined" ? '-' : item.cargo?.nombre,
        turno: item.turno?.nombre === "undefined" ? '-' : item.turno?.nombre,
        telefono: item?.celular === "undefined" ? '-' : item?.celular,
        notShow: {
          foto: item.foto
        }

      }));
      setDataFormatted(formattedData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadFiltersData = async () => {
    try {
      const [subgerenciasData, turnosData, cargosData] = await Promise.all([
        fetchSubgerencias(),
        fetchTurnos(),
        fetchCargos(),
      ]);

      setDataSelects({

        subgerencias: mapToSelectOptions(subgerenciasData?.data),
        turnos: mapToSelectOptions(turnosData?.data),
        cargos: mapToSelectOptions(cargosData?.data)
      })

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
  }

  const handleRowClick = (event, row) => {
    const foto = row.notShow.foto

    if (foto) {
      setSelectedImage(foto);
      setImageZoomOpen(true);
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const exportToExcel = () => {
    const params = location.search;

    // Convertir los parámetros a un objeto
    const urlSearchParams = new URLSearchParams(params);

    // Quitar las propiedades 'page' y 'limit'
    urlSearchParams.delete('page');
    urlSearchParams.delete('limit');

    // Reconstruir el string de parámetros
    const updatedParams = `?${urlSearchParams.toString()}&page=0`;

    getData(`${import.meta.env.VITE_APP_ENDPOINT}/empleados/${updatedParams}`, token).then((response) => {
      const data = response.data.data.data.map((item) => ({
        'APELLIDOS': item.apellidos === "undefined" ? '-' : item.apellidos,
        'NOMBRES': item.nombres === "undefined" ? '-' : item.nombres,
        'SUBGERENCIA': item.subgerencia?.nombre === "undefined" ? '-' : item.subgerencia?.nombre,
        'CARGO': item.cargo?.nombre === "undefined" ? '-' : item.cargo?.nombre,
        'TURNO': item.turno?.nombre === "undefined" ? '-' : item.turno?.nombre,
        'TELEFONO': item?.celular === "undefined" ? '-' : item?.celular,

      }));

      // Crear la hoja de trabajo
      const worksheet = XLSX.utils.json_to_sheet(data);

      worksheet['!cols'] = [
        { wch: 20 }, // NOMBRES
        { wch: 20 }, // APELLIDOS
        { wch: 25 }, // SUBGERENCIA
        { wch: 20 }, // CARGO
        { wch: 15 }, // TURNO
        { wch: 15 }, // TELEFONO

      ];

      // Estilos de las celdas
      const range = XLSX.utils.decode_range(worksheet['!ref']);
      for (let row = range.s.r; row <= range.e.r; row++) {
        for (let col = range.s.c; col <= range.e.c; col++) {
          const address = XLSX.utils.encode_cell({ r: row, c: col });
          const cell = worksheet[address];

          if (cell) {
            // Estilo general de celdas
            cell.s = {
              font: { bold: false, color: { rgb: "000000" }, sz: 12 }, // Color de texto y tamaño
              alignment: { horizontal: 'center', vertical: 'center' },  // Alineación centrada
              border: {
                top: { style: 'thin', color: { rgb: '000000' } },
                left: { style: 'thin', color: { rgb: '000000' } },
                bottom: { style: 'thin', color: { rgb: '000000' } },
                right: { style: 'thin', color: { rgb: '000000' } }
              }
            };

            // Ejemplo de celdas específicas: encabezados
            if (row === 0) {
              cell.s.font = { color: { rgb: 'FFFFFF' }, bold: true, sz: 12 };
              cell.s.fill = { fgColor: { rgb: '16a34a' } }; // Fondo verde en los encabezados
            }
          }
        }
      }

      // Crear el libro y agregar la hoja
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Empleados');

      // Generar el archivo de Excel con los estilos aplicados
      XLSX.writeFile(workbook, 'EmpleadosDB.xlsx');

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
    <div className="relative flex flex-col h-full w-full bg-gray-100 p-4">
      <header className="text-white bg-green-700 py-4 px-3 mb-6 w-full rounded-lg flex justify-center relative">
        <Link onClick={() => navigate(-1)} className="flex items-center gap-1">
          <ArrowBackIosNewRoundedIcon className="absolute left-4" />
        </Link>
        <h1 className="md:text-2xl lg:text-4xl font-bold text-center">
          BASE DE DATOS DEL PERSONAL
        </h1>
      </header>

      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div>
          <Button
            onClick={handleClick}
            className="flex items-center gap-1 !capitalize !text-black"
          >
            {open ? (
              <FilterAltOffIcon sx={{ fontSize: '1.2rem' }} />
            ) : (
              <FilterListIcon sx={{ fontSize: '1.2rem' }} />
            )}
            Filtros
          </Button>
        </div>
        <SearchInput />
      </div>

      <main className="flex-1 bg-white shadow rounded-lg p-6 h-full overflow-hidden">
        <div className="flex flex-col w-full h-full space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm md:text-base">
              Total de filas: <span id="rowCount" className="font-bold">{count || 0}</span>
            </span>

            {/* Figuras para Descargar e Importar */}
            <div className="flex items-center gap-4">
              {/* Botón para Descargar */}
              <Tooltip title="Descargar Excel" arrow>
                <IconButton
                  onClick={() => exportToExcel()}
                  className="!bg-green-500 !text-white hover:!bg-green-600"
                >
                  <DownloadIcon />
                </IconButton>
              </Tooltip>

              {/* Botón para Importar */}
              {/* <Tooltip title="Importar Excel" arrow>
                <IconButton
                  onClick={() => console.log('Importar')}
                  className="!bg-blue-500 !text-white hover:!bg-blue-600"
                >
                  <UploadIcon />
                </IconButton>
              </Tooltip> */}
            </div>
          </div>

          <CRUDTable data={dataFormatted} loading={loading} count={count} rowOnClick={handleRowClick} />
        </div>
      </main>

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
        <CloseRoundedIcon
          className="absolute top-5 right-5 cursor-pointer"
          onClick={() => setAnchorEl(null)}
        />
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-700 pb-4">Filtros</h1>
          <div className="flex flex-wrap justify-center max-w-[500px] max-h-[500px] overflow-y-auto overflow-x-hidden">
            {/* Turnos */}
            <div className="w-full sm:w-1/2 px-2 pb-2">
              <label className="text-sm font-semibold text-gray-600" htmlFor="turno-label">Turno</label>
              <FiltroSelect
                name="turnos"
                placeholder={'Seleccione un turno'}
                onChange={(e) => addParams({ turno: e.target.value })}
                value={params.turno || ''}
                options={DataSelects.turnos}
              />
            </div>

            {/* Cargo */}
            <div className="w-full sm:w-1/2 px-2 pb-2">
              <label className="text-sm font-semibold text-gray-600" htmlFor="cargo-label">Cargo</label>
              <FiltroSelect
                name="cargo"
                placeholder={'Seleccione un cargo'}
                onChange={(e) => addParams({ cargo: e.target.value })}
                value={params.cargo || ''}
                options={DataSelects.cargos}
              />
            </div>

            {/* Subgerencia */}
            <div className="w-full sm:w-1/2 px-2 pb-2">
              <label className="text-sm font-semibold text-gray-600" htmlFor="subgerencia-label">Subgerencia</label>
              <FiltroSelect
                name="subgerencias"
                placeholder={'Seleccione una subgerencia'}
                onChange={(e) => addParams({ subgerencia: e.target.value })}
                value={params.subgerencia || ''}
                options={DataSelects.subgerencias}
              />
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
      <ImageZoom
        open={imageZoomOpen}
        onClose={() => setImageZoomOpen(false)}
        imageSrc={selectedImage}
        altText="Foto del empleado"
      />


    </div>
  );
};

export default PersonalBD;