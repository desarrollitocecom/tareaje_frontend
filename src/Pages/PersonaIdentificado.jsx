import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Paper,
  TableRow,
  Button,
} from "@mui/material";
import CustomSwal from "../helpers/swalConfig";
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import SchoolIcon from '@mui/icons-material/School';
import CommentIcon from '@mui/icons-material/Comment';

const personasData = [
  {
    id: "1",
    nombres: "Ana Pérez",
    subgerencia: "Subgerencia de serenazgo",
    dni: "12345678",
    ruc: "20123456789",
    cargo: "Gerente",
    turno: "Mañana",
    regimen: "Planilla",
    sexo: "Femenino",
    hijos: 2,
    edad: 30,
    jurisdiccion: "Lima",
    fechaNacimiento: "01/01/1990",
    lugarTrabajo: "Oficina Principal",
    correo: "correo@ejemplo.com",
    domicilio: "Calle Ejemplo 123",
    celular: "987654321",
    fechaInicio: "01/01/2020",
    gradoEstudios: "Bachiller",
    observaciones: "Ninguna",
    imagen:
      "https://th.bing.com/th/id/OIP.Y4_ks4-nJ_soelRGYS90LwHaLH?rs=1&pid=ImgDetMain",
  },
];

const PersonaIdentificado = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const persona = personasData.find((p) => p.id === id);

  useEffect(() => {
    if (!persona) {
      navigate("/buscar");
      CustomSwal.fire({
        icon: "error",
        title: "Persona no encontrada",
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        showCancelButton: false,
        timer: 2000,
        timerProgressBar: true,
      })
    }

  }, [persona])

  if (!persona) {
    return null; // No renderizar nada mientras se redirige
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
          INFORMACIÓN DEL PERSONAL
        </h1>
      </header>

      <div className="bg-white p-6 rounded-lg shadow-lg text-sm flex flex-col flex-1 overflow-hidden">
        <div className="container overflow-auto">
          <div className="w-full flex justify-center">
            <div className="w-full max-w-[95%] flex flex-col md:flex-row gap-3 md:gap-8 items-center">
              <img
                src={persona.imagen}
                alt="Persona"
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover shadow-xl"
              />
              <div className="flex flex-col justify-center items-center md:items-start text-center md:text-left mb-3">
                <h2 className="text-xl md:text-2xl font-semibold">{persona.nombres}</h2>
                <p className="text-gray-500 text-md md:text-base">{persona.subgerencia}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center">
            {/* Información Personal */}
            <div className="w-full max-w-[95%] py-6">
              <div className="flex items-center gap-1"><PersonIcon className="text-gray-600" /> <h3 className="text-lg font-semibold">Información Personal</h3></div>
              <div className="flex justify-center px-5 md:px-10">
                <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-3">
                  <div>
                    <p className="text-sm font-medium">Nombre:</p>
                    <p className="text-base text-gray-800">{persona.nombres}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Sexo:</p>
                    <p className="text-base text-gray-800">{persona.sexo}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Edad:</p>
                    <p className="text-base text-gray-800">{persona.edad}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Hijos:</p>
                    <p className="text-base text-gray-800">{persona.hijos}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Fecha de Nacimiento:</p>
                    <p className="text-base text-gray-800">{persona.fechaNacimiento}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Correo:</p>
                    <p className="text-base text-gray-800">{persona.correo}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Domicilio:</p>
                    <p className="text-base text-gray-800">{persona.domicilio}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Celular:</p>
                    <p className="text-base text-gray-800">{persona.celular}</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Información Laboral */}
            <div className="w-full max-w-[95%] py-6">
              <div className="flex items-center gap-1"><WorkIcon className="text-gray-600" /> <h3 className="text-lg font-semibold">Información Laboral</h3></div>
              <div className="flex justify-center px-5 md:px-10">
                <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-3">

                  <div>
                    <p className="text-sm font-medium">Subgerencia:</p>
                    <p className="text-base text-gray-800">{persona.subgerencia}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Lugar de Trabajo:</p>
                    <p className="text-base text-gray-800">{persona.lugarTrabajo}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Cargo:</p>
                    <p className="text-base text-gray-800">{persona.cargo}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Turno:</p>
                    <p className="text-base text-gray-800">{persona.turno}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Régimen:</p>
                    <p className="text-base text-gray-800">{persona.regimen}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Fecha de Inicio:</p>
                    <p className="text-base text-gray-800">{persona.fechaInicio}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Jurisdicción:</p>
                    <p className="text-base text-gray-800">{persona.jurisdiccion}</p>
                  </div>

                </div>
              </div>
            </div>
            {/* Información Documentaria */}
            <div className="w-full max-w-[95%] py-6">
              <div className="flex items-center gap-1">
                <AssignmentIndIcon className="text-gray-600" />
                <h3 className="text-lg font-semibold">Información Documentaria</h3>
              </div>
              <div className="flex justify-center px-5 md:px-10">
                <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-3">
                  <div>
                    <p className="text-sm font-medium">DNI:</p>
                    <p className="text-base text-gray-800">{persona.dni}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">RUC:</p>
                    <p className="text-base text-gray-800">{persona.ruc}</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Información Académica */}
            <div className="w-full max-w-[95%] py-6">
              <div className="flex items-center gap-1">
                <SchoolIcon className="text-gray-600" />
                <h3 className="text-lg font-semibold">Información Académica</h3>
              </div>
              <div className="flex justify-center px-5 md:px-10">
                <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-3">
                  <div>
                    <p className="text-sm font-medium">Grado de Estudios:</p>
                    <p className="text-base text-gray-800">{persona.gradoEstudios}</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Información Académica */}
            <div className="w-full max-w-[95%] py-6">
              <div className="flex items-center gap-1">
                <CommentIcon className="text-gray-600" />
                <h3 className="text-lg font-semibold">Observaciones</h3>
              </div>
              <div className="flex justify-center px-5 md:px-10">
                <div className="w-full">
                  <p className="text-base text-gray-800">{persona.observaciones}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonaIdentificado;
