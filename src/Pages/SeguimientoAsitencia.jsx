import React, { useEffect, useState } from "react";
import useDataSeguimiento from "../Components/hooks/useDataSeguimiento"; // Importa el hook
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import { Accordion, AccordionDetails, AccordionSummary, Button, IconButton, Tooltip } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link, useNavigate } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers";
import { currentYear, isSameWeek } from "../helpers/DayJs.Confg";
import CustomPopover from "../Components/Popover/CustomPopover";
import DateRangeIcon from '@mui/icons-material/DateRange';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import dayjs from "dayjs";
import { DateRange } from 'react-date-range';
import CustomSwal from "../helpers/swalConfig";
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import SaveIcon from '@mui/icons-material/Save';
import { es } from "date-fns/locale";

const SeguimientoAsistencia = () => {
  const navigate = useNavigate()
  const [Fecha, setFecha] = useState(new Date());
  const [weekRange, setWeekRange] = useState([null, null]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [weekDates, setWeekDates] = useState([]);
  const [rangeDates, setRageDates] = useState([{
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
  }]);
  const [isPrevDisabled, setIsPrevDisabled] = useState(false);
  const [isNextDisabled, setIsNextDisabled] = useState(false);
  const [editCalendar, setEditCalendar] = useState(false)

  const { datosAsistencias, meses, anios, turnos } = useDataSeguimiento();

  const today = new Date();

  useEffect(() => {
    // Función para obtener el lunes de la semana
    const getMonday = (date) => {
      const day = date.getDay(); // Día de la semana (0 = domingo, 1 = lunes, etc.)
      const diff = day === 0 ? -6 : 1 - day; // Si es domingo, restar 6, de lo contrario calcular diferencia al lunes
      const monday = new Date(date);
      monday.setDate(date.getDate() + diff);
      return monday;
    };

    // Obtener el lunes y el domingo de la semana
    const startOfWeek = getMonday(Fecha);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Sumamos 6 días para obtener el domingo

    // Actualizamos el estado con el rango de la semana
    setWeekRange([startOfWeek, endOfWeek]);

    setWeekDates(Array.from({ length: 7 }, (_, i) => {
      const newDate = new Date(startOfWeek);
      newDate.setDate(startOfWeek.getDate() + i);
      return newDate;
    }));
  }, [Fecha]);

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


  // Función para formatear la fecha
  const formatDate = (DateString) => {
    const date = new Date(DateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Los meses empiezan en 0
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}-${month}-${year}`;
  };

  const handleTodayClick = () => {
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    const isSameStartEnd = (!startDate && !endDate) || start.isSame(end);
    const isBetween = dayjs(today).isAfter(dayjs(startDate)) && dayjs(today).isBefore(dayjs(endDate));

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

  return (
    <div className="w-full bg-gray-100 px-6 py-8 h-full flex flex-col overflow-auto overflow-y-scroll">
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

      <div className="bg-white p-6 rounded-lg shadow-lg text-sm flex flex-col flex-1 pb-5">
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
          <span className="text-sm md:text-base font-semibold text-center">
            {formatDate(weekRange[0])} - {formatDate(weekRange[1])}
          </span>
          <div className="flex gap-2">
            <div>
              <Tooltip title={`${editCalendar ? "Guardar Ediciòn" : "Activar Ediciòn"}`} placement='top' arrow>
                <Button
                  color="inherit"
                  className="p-2 rounded-lg flex items-center justify-center gap-1 "
                  onClick={ToggleEditCalendar}
                  sx={{ textTransform: 'none', minWidth: '30px' }}
                >
                  {editCalendar ?
                    (<SaveIcon sx={{ fontSize: 20 }} />)
                    :
                    (<EditCalendarIcon sx={{ fontSize: 20 }} />)
                  }
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
        <div className="overflow-x-auto !select-none">
          <table className="min-w-full bg-white border text-xs text-nowrap">
            <thead>
              <tr>
                <th className="py-2 px-4 border">APELLIDO</th>
                <th className="py-2 px-4 border">DNI</th>
                <th className="py-2 px-4 border">TURNO</th>
                {weekDates.map((fecha, i) => {
                  const formattedFecha = new Date(fecha);
                  today.setHours(0, 0, 0, 0);
                  formattedFecha.setHours(0, 0, 0, 0);

                  // Comparar las fechas
                  const isToday = formattedFecha.getTime() === today.getTime();
                  const isOutOfRange = startDate && endDate && dayjs(fecha).isBefore(dayjs(startDate)) || dayjs(fecha).isAfter(dayjs(endDate));

                  const getClassName = () => {
                    const baseClasses = 'py-2 px-4 border';
                    const outOfRangeClasses = isOutOfRange ? 'bg-gray-200 border-gray-300 text-gray-400' : '';
                    const todayClasses = isToday ? 'bg-blue-100 !border-blue-400 border-l-1 border-r-1' : 'border-r-0';

                    return `${baseClasses} ${outOfRangeClasses} ${todayClasses}`.trim();
                  };

                  return (
                    <th
                      key={i}
                      className={getClassName()}
                    >
                      {fecha.toLocaleString("es-ES", { weekday: "short" }).toUpperCase()}
                      <br />
                      {formatDate(fecha)}
                    </th>

                  );
                })}
                <th className="py-2 px-4 border">ACCIÓN</th>
              </tr>
            </thead>
            <tbody>
              {datosAsistencias.map((asistencia, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border">{asistencia.apellido}</td>
                  <td className="py-2 px-4 border">{asistencia.dni}</td>
                  <td className="py-2 px-4 border">{asistencia.turno}</td>
                  {asistencia.dias.map((dia, diaIndex) => (
                    <td key={diaIndex} className="py-2 px-4 border text-center">
                      {dia}
                    </td>
                  ))}
                  <td className="py-2 px-4 border text-center">
                    <button className="bg-blue-500 text-white p-2 rounded-lg">
                      Más info
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div >
  );
};

export default SeguimientoAsistencia;
