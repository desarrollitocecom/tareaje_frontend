import React, { useEffect, useState } from "react";
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import { Button, CircularProgress, IconButton, Tooltip } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers";
import DateRangeIcon from '@mui/icons-material/DateRange';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import dayjs from "dayjs";
import { DateRange } from 'react-date-range';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { da, es } from "date-fns/locale";
import { formatDate, FormatoEnvioFecha } from "../../helpers/GeneralFunctions";
import useFetch from "../../Components/hooks/useFetch";
import { useSelector } from "react-redux";
import CustomTablePagination from "../Pagination/TablePagination";
import { isSameWeek } from "../../helpers/DayJs.Confg";
import CustomPopover from "../../Components/Popover/CustomPopover";
import CustomSwal, { swalError } from "../../helpers/swalConfig";

const SeguimientoAsistencia = () => {
  const navigate = useNavigate()
  const location = useLocation();
  const { postData } = useFetch()
  const { token } = useSelector((state) => state.auth);
  const [Fecha, setFecha] = useState(new Date());
  const [weekRange, setWeekRange] = useState([null, null]);
  const [startDate, setStartDate] = useState(null);
  const [count, setCount] = useState(0)
  const [endDate, setEndDate] = useState(null);
  const [weekDates, setWeekDates] = useState([]);
  const [rangeDates, setRageDates] = useState([{
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
  }]);
  const [dataAsistencias, setDataAsistencias] = useState([])
  const [isLoadingAsistencia, setisLoadingAsistencia] = useState(false)
  const [isPrevDisabled, setIsPrevDisabled] = useState(false);
  const [isNextDisabled, setIsNextDisabled] = useState(false);
  const [editCalendar, setEditCalendar] = useState(false)

  const [showDatePicker, setshowDatePicker] = useState(false)
  const [RefreshData, setRefreshData] = useState(false)

  const today = new Date();

  useEffect(() => {
    // Obtener el lunes y el domingo de la semana
    const startOfWeek = getMonday(Fecha);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Sumamos 6 días para obtener el domingo

    const isBetween = (
      (dayjs(Fecha).isAfter(dayjs(weekRange[0])) || dayjs(Fecha).isSame(dayjs(weekRange[0]))) &&
      (dayjs(Fecha).isBefore(dayjs(weekRange[1])) || dayjs(Fecha).isSame(dayjs(weekRange[1])))
    );

    if (isBetween) return;

    // Actualizamos el estado con el rango de la semana
    setWeekRange([startOfWeek, endOfWeek]);

    getAsistenciaDiaria(Fecha, false);

    setWeekDates(Array.from({ length: 7 }, (_, i) => {
      const newDate = new Date(startOfWeek);
      newDate.setDate(startOfWeek.getDate() + i);
      return newDate;
    }));
  }, [Fecha, rangeDates]);

  useEffect(() => {
    const startOfWeek = getMonday(Fecha);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Sumamos 6 días para obtener el domingo

    getAsistenciaDiaria(Fecha, true, location.search);
  }, [location.search, RefreshData]);

  const MAX_CACHE_ITEMS = 50; // Máximo de elementos en el array de caché
  const CACHE_EXPIRATION_TIME = 1 * 60 * 1000; // 5 minutos en milisegundos

  const getAsistenciaDiaria = (Fecha, forceUpdate = false, urlParams) => {
    const cacheKey = 'asistencia_cache'; // Clave para guardar el array de caché
    const currentTime = new Date().getTime();

    // Obtén la caché completa desde localStorage
    let cache = JSON.parse(localStorage.getItem(cacheKey)) || [];

    // Función para crear el rango de las tres semanas (una antes, actual y siguiente)
    const createWeekRanges = (currentDate) => {
      const startOfWeek = getMonday(currentDate);
      const weeks = [];

      // Semana actual
      weeks.push({
        start: startOfWeek,
        end: new Date(startOfWeek).setDate(startOfWeek.getDate() + 6),
      });

      // Semana anterior
      const prevWeekStart = new Date(startOfWeek);
      prevWeekStart.setDate(startOfWeek.getDate() - 7);
      weeks.push({
        start: prevWeekStart,
        end: new Date(prevWeekStart).setDate(prevWeekStart.getDate() + 6),
      });

      // Semana siguiente
      const nextWeekStart = new Date(startOfWeek);
      nextWeekStart.setDate(startOfWeek.getDate() + 7);
      weeks.push({
        start: nextWeekStart,
        end: new Date(nextWeekStart).setDate(nextWeekStart.getDate() + 6),
      });

      return weeks;
    };

    // Crea los rangos de las tres semanas alrededor de la semana actual
    const weeksToCheck = createWeekRanges(new Date(Fecha));

    // Revisa si alguna de las semanas ya está en caché y si la fecha ha expirado
    let currentWeekData = null;
    weeksToCheck.forEach((week, index) => {
      const { start, end } = week;
      const startDate = FormatoEnvioFecha(start);
      const endDate = FormatoEnvioFecha(end);
      const existingEntryIndex = cache.findIndex(
        (entry) => entry.inicio === startDate && entry.fin === endDate
      );

      // Si no hay necesidad de forzar actualización y la entrada es válida, usa los datos
      if (
        !forceUpdate &&
        existingEntryIndex !== -1 &&
        (currentTime - cache[existingEntryIndex].timestamp) < CACHE_EXPIRATION_TIME
      ) {
        if (index === 0) {
          // Guardamos los datos de la semana actual
          currentWeekData = cache[existingEntryIndex].data;
        }
        return;
      }

      // Mostrar loader solo para la semana actual
      if (index === 0) {
        setisLoadingAsistencia(true);
      }

      // Si no hay caché válida o se forza la actualización, solicita los datos del servidor
      postData(`${import.meta.env.VITE_APP_ENDPOINT}/asistencias/${urlParams || ''}`, { inicio: startDate, fin: endDate }, token, true)
        .then((res) => {
          if (res.status) {            
            setCount(res.data.totalCount);
            
            const newEntry = {
              inicio: startDate,
              fin: endDate,
              data: res.data.data,
              timestamp: currentTime,
            };

            // Si ya existe una entrada, reemplázala; de lo contrario, añade una nueva
            if (existingEntryIndex !== -1) {
              cache[existingEntryIndex] = newEntry;
            } else {
              cache.push(newEntry);
            }

            // Si supera el límite, elimina las entradas más antiguas
            if (cache.length > MAX_CACHE_ITEMS) {
              cache = cache.slice(-MAX_CACHE_ITEMS); // Mantén solo las últimas `MAX_CACHE_ITEMS`
            }

            // Actualiza la caché en localStorage
            localStorage.setItem(cacheKey, JSON.stringify(cache));

            if (index === 0) {
              currentWeekData = res.data.data;
              setDataAsistencias(currentWeekData);
            }
          } else {
            throw res.error;
          }
        })
        .catch((err) => {
          swalError(err.response?.data);
        })
        .finally(() => {
          // Solo apagar el loader para la semana actual
          if (index === 0) {
            setisLoadingAsistencia(false);
          }
        });
    });

    // Si hemos encontrado los datos de la semana actual, los mostramos
    if (currentWeekData) {
      setDataAsistencias(currentWeekData);
    }
  };

  // Función para obtener el lunes de la semana
  const getMonday = (date) => {
    const day = date.getDay(); // Día de la semana (0 = domingo, 1 = lunes, etc.)
    const diff = day === 0 ? -6 : 1 - day; // Si es domingo, restar 6, de lo contrario calcular diferencia al lunes
    const monday = new Date(date);
    monday.setDate(date.getDate() + diff);
    return monday;
  };


  // Función para cambiar a la semana anterior
  const handleSemanaAnterior = () => {
    setFecha((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() - 7); // Restar 7 días

      // Calcular la fecha que está 14 días antes de prevDate
      const twoWeeksBefore = new Date(prevDate);
      twoWeeksBefore.setDate(prevDate.getDate() - 14);

      const dayjsNewDate = dayjs(twoWeeksBefore);
      // Verificar si la fecha de 14 días antes es anterior a startDate
      const isBeforeStartDate = dayjsNewDate.isBefore(dayjs(startDate));

      setIsPrevDisabled(isBeforeStartDate); // Deshabilitar el botón si se pasa de la fecha inicial
      setIsNextDisabled(false); // Habilitar el botón de siguiente

      return newDate; // Retornar la nueva fecha
    });
  };

  // Función para cambiar a la semana siguiente
  const handleSemanaSiguiente = () => {
    setFecha((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() + 7);

      // Calcular la fecha que está 14 día despues de prevDate
      const twoWeeksAfter = new Date(prevDate);
      twoWeeksAfter.setDate(prevDate.getDate() + 14);

      const dayjsNewDate = dayjs(twoWeeksAfter);
      // Verificar si la fecha de 14 día despues es posterior a endDate
      const isAfterEndDate = dayjsNewDate.isAfter(dayjs(endDate));

      setIsNextDisabled(isAfterEndDate); // Deshabilitar el botón si se pasa de la fecha final
      setIsPrevDisabled(false); // Habilitar el botón de anterior

      return newDate; // Retornar la nueva fecha
    });
  };


  

  const handleTodayClick = () => {
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    const isSameStartEnd = (!startDate && !endDate) || start.isSame(end);
    const isBetween = dayjs(today).isAfter(dayjs(startDate)) || dayjs(Fecha).isSame(dayjs(startDate)) && dayjs(today).isBefore(dayjs(endDate)) || dayjs(today).isSame(dayjs(endDate));


    if (isSameStartEnd || isBetween) {
      setFecha(today);
    } else {
      CustomSwal.fire({
        icon: "error",
        title: "Fecha fuera de rango",
        position: "top-end",
        toast: true,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
  };

  const ToggleEditCalendar = () => {
    setEditCalendar((prev) => !prev)
  }

  const getClassName = (fecha) => {
    const formattedFecha = new Date(fecha);
    today.setHours(0, 0, 0, 0);
    formattedFecha.setHours(0, 0, 0, 0);

    const isToday = formattedFecha.getTime() === today.getTime();
    const isOutOfRange = startDate && endDate && (new Date(fecha) < new Date(startDate) || new Date(fecha) > new Date(endDate));

    const baseClasses = 'py-2 px-2 border';
    const outOfRangeClasses = isOutOfRange ? 'bg-gray-200 border-gray-300 text-gray-400' : '';
    const todayClasses = isToday ? 'bg-blue-100 !border-blue-400 border-l-1 border-r-1' : 'border-r-0';

    return `${baseClasses} ${outOfRangeClasses} ${todayClasses}`.trim();
  };

  return (
    <div className="w-full bg-gray-100 p-4 h-full flex flex-col">
      <header className="text-white bg-green-700 py-4 px-3 mb-6 w-full rounded-lg flex justify-center relative">
        <Link onClick={() => navigate(-1)} className='flex items-center gap-1'>
          <ArrowBackIosNewRoundedIcon
            className='!size-5 md:!size-6 mt-[0.1rem] absolute left-4'
          />
        </Link>
        <h1 className="md:text-2xl lg:text-4xl font-bold text-center">
          SEGUIMIENTO DE ASISTENCIAS
        </h1>
      </header>

      <div className="bg-white p-6 rounded-lg shadow-lg text-sm flex flex-col flex-1 pb-5 overflow-hidden">
        <div className="pb-6 flex justify-between">
          <div>
            <CustomPopover
              CustomIcon={DateRangeIcon}
              label={"Filtro Fechas"}
            >
              <div className="absolute top-1 right-1">
                <Tooltip title="Limpiar Filtro" placement='top' arrow>
                  <IconButton
                    onClick={() => {
                      const today = new Date();
                      setStartDate(null);
                      setEndDate(null);
                      setIsPrevDisabled(false);
                      setIsNextDisabled(false);
                      setFecha(today);
                      setRageDates([
                        {
                          startDate: today,
                          endDate: today,
                          key: 'selection',
                        },
                      ]);
                    }}
                    aria-label="Limpiar"
                    className="!p-2 z-10"
                  >
                    <FilterAltOffIcon
                      className="cursor-pointer text-gray-500"
                      sx={{ fontSize: 20 }} // Ajustar el tamaño según el diseño
                    />
                  </IconButton>
                </Tooltip>
              </div>
              <div className="p-2 relative">
                <div className="text-gray-500 font-semibold">
                  Filtro por fechas
                </div>
                <DateRange
                  editableDateInputs={true}
                  maxDate={new Date()}
                  onChange={item => {
                    const { startDate: start, endDate: end } = item.selection;
                    const isSameWeekResult = isSameWeek(start, end);

                    setStartDate(start);
                    setEndDate(end);
                    setIsPrevDisabled(isSameWeekResult);
                    setIsNextDisabled(true);
                    setFecha(end);
                    setRageDates([item.selection]);
                  }}
                  moveRangeOnFirstSelection={false}
                  ranges={rangeDates}
                  weekStartsOn={1}
                  locale={es}
                />
              </div>
            </CustomPopover>
          </div>
          <div>

          </div>
        </div>

        {/* Navegación de semanas */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <div>
            <Button
              color="primary"
              variant="contained"
              size="small"
              disabled={isSameWeek(Fecha, today)}
              onClick={handleTodayClick}
              sx={{ textTransform: 'none' }}
            >
              Hoy
            </Button>
          </div>
          <div className="relative">
            <DemoContainer date components={['DatePicker']}>
              <DatePicker
                className="opacity-0 !absolute z-[-1] bottom-0 right-0"
                onClose={() => setshowDatePicker(false)}
                maxDate={dayjs(endDate)}
                minDate={dayjs(startDate)}
                open={showDatePicker}
                value={dayjs(Fecha)}
                onChange={(e) => setFecha(e.toDate())}
                label="Fecha actual"
              />
            </DemoContainer>
            <span
              className="text-sm md:text-base font-semibold text-center cursor-pointer"
              onClick={() => setshowDatePicker((prev) => !prev)}
            >
              {formatDate(weekRange[0])} - {formatDate(weekRange[1])}
            </span>
          </div>
          <div className="flex gap-2">
            <div>
              {/* <Tooltip title={`${editCalendar ? "Guardar Ediciòn" : "Activar Ediciòn"}`} placement='top' arrow>
                <Button
                  color="inherit"
                  className="p-2 rounded-lg flex items-center justify-center gap-1 "
                  onClick={ToggleEditCalendar}
                  sx={{ textTransform: 'none', minWidth: '30px' }}
                >
                  {editCalendar ?
                    (<SaveIcon sx={{ fontSize: 20 }} />)
                    :
                    (<EditIcon sx={{ fontSize: 20 }} />)
                  }
                </Button>
              </Tooltip> */}
              <Tooltip title={`Refrescar Calendario`} placement='top' arrow>
                <Button
                  color="inherit"
                  className="p-2 rounded-lg flex items-center justify-center gap-1 "
                  onClick={() => setRefreshData((prev) => !prev)}
                  sx={{ textTransform: 'none', minWidth: '30px' }}
                >
                  <RefreshRoundedIcon />
                </Button>
              </Tooltip>
            </div>
            <div className="flex w-full sm:w-auto justify-between sm:justify-center">
              <Tooltip title="Anterior Semana" placement='top' arrow>
                <Button
                  color="inherit"
                  className="p-2 rounded-lg flex items-center justify-center gap-1 "
                  onClick={handleSemanaAnterior}
                  disabled={isPrevDisabled}
                  sx={{ textTransform: 'none', minWidth: '30px' }}
                >
                  <ArrowBackIosNewRoundedIcon sx={{ fontSize: 16 }} />
                </Button>
              </Tooltip>
              <Tooltip title="Siguiente Semana" placement='top' arrow>
                <Button
                  color="inherit"
                  className="p-2 rounded-lg flex items-center justify-center gap-1"
                  onClick={handleSemanaSiguiente}
                  disabled={isNextDisabled}
                  sx={{ textTransform: 'none', minWidth: '30px' }}
                >
                  <ArrowForwardIosRoundedIcon sx={{ fontSize: 16 }} />
                </Button>
              </Tooltip>
            </div>
          </div>

        </div>

        {/* Filtrar por turno */}
        {/* <div className="mb-4 text-sm flex">
          <div className="w-full sm:max-w-60">
            <label className="block mb-2 font-medium">Filtrar por turno:</label>
            <select className="w-full p-2 border rounded-lg">
              {turnos.map((turno, index) => (
                <option key={index} value={turno}>
                  {turno}
                </option>
              ))}
            </select>
          </div>
        </div> */}

        {/* Tabla de asistencias */}
        <div className="flex flex-col h-full overflow-hidden">
          <div className="!select-none flex flex-1 overflow-auto">
            <table className="min-w-full bg-white border text-xs text-nowrap">
              <thead>
                <tr>
                  <th className="py-2 px-2 border min-w-[72px]">NOMBRE</th>
                  <th className="py-2 px-2 border min-w-[72px]">APELLIDO</th>
                  {/* <th className="py-2 px-2 border">DNI</th> */}
                  <th className={`py-2 px-2 border min-w-[72px] ${today.getDay() === 1 ? 'border-r-0' : ''}`}>TURNO</th>
                  {weekDates.map((fecha, i) => {
                    return (
                      <th
                        key={i}
                        className={getClassName(fecha)}
                      >
                        {fecha.toLocaleString("es-ES", { weekday: "short" }).toUpperCase()}
                        <br />
                        {formatDate(fecha)}
                      </th>

                    );
                  })}
                  {/* <th className="py-2 px-2 border">ACCIÓN</th> */}
                </tr>
              </thead>
              <tbody>
                {isLoadingAsistencia ? (
                  // Renderiza un loader en lugar de celdas mientras se cargan los datos
                  <tr>
                    <td colSpan={weekDates.length + 4} className="py-4 text-center">
                      <CircularProgress />
                      <p>Cargando asistencia...</p>
                    </td>
                  </tr>
                ) : (
                  // Renderiza los datos reales cuando se cargan
                  dataAsistencias.map((asistencia) => (
                    <tr key={asistencia.id_empleado}>
                      <td className="py-2 px-2 border max-w-10 overflow-hidden text-ellipsis">{asistencia.nombres}</td>
                      <td className="py-2 px-2 border max-w-10 overflow-hidden text-ellipsis">{asistencia.apellidos}</td>
                      <td className="py-2 px-2 border max-w-10 overflow-hidden text-ellipsis">{asistencia.turno}</td>
                      {asistencia.estados.map((asistencia) => (
                        <td key={asistencia.id_empleado + asistencia.fecha} className="py-2 px-2 border text-center">
                          {asistencia.asistencia ? asistencia.asistencia : '-'}
                        </td>
                      ))}
                      {/* <td className="py-2 px-2 border text-center">
                        <button className="bg-blue-500 text-white p-2 rounded-lg">
                          Más info
                        </button>
                      </td> */}
                    </tr>
                  ))
                )}
              </tbody>

            </table>
          </div>
          <div className='flex justify-end pt-4'>
            <CustomTablePagination count={count}/>
          </div>
        </div>
      </div>

    </div >
  );
};

export default SeguimientoAsistencia;