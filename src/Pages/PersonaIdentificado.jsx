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

const personasData = [
  {
    id: "1",
    nombres: "Ana Pérez",
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

  // Dividir datos en dos partes
  const dataPart1 = [
    { label: "Nombres y Apellidos", value: persona.nombres },
    { label: "DNI", value: persona.dni },
    { label: "RUC", value: persona.ruc },
    { label: "Cargo", value: persona.cargo },
    { label: "Turno", value: persona.turno },
    { label: "Régimen Laboral", value: persona.regimen },
    { label: "Sexo", value: persona.sexo },
    { label: "Cantidad de Hijos", value: persona.hijos },
    { label: "Edad", value: persona.edad },
  ];

  const dataPart2 = [
    { label: "Jurisdicción", value: persona.jurisdiccion },
    { label: "Fecha de Nacimiento", value: persona.fechaNacimiento },
    { label: "Lugar de Trabajo", value: persona.lugarTrabajo },
    { label: "Correo Electrónico", value: persona.correo },
    { label: "Domicilio", value: persona.domicilio },
    { label: "Celular", value: persona.celular },
    { label: "Fecha de Inicio de Labores", value: persona.fechaInicio },
    { label: "Grado de Estudios", value: persona.gradoEstudios },
    { label: "Observaciones", value: persona.observaciones },
  ];

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

      <div className="bg-white p-6 rounded-lg shadow-lg text-sm flex flex-col flex-1">
        <div
          className="bg-white p-6 text-sm flex flex-col mx-auto mt-16"

        >
          {/* Contenedor de tablas divididas */}
          <div className="flex">
            <TableContainer style={{ marginRight: "20px", width: "400px" }}>
              <Table aria-label="simple table">
                <TableBody>
                  {dataPart1.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.label}</TableCell>
                      <TableCell>{row.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Contenedor de imagen y botón */}
            <div
              className="flex flex-col items-center"
              style={{ marginRight: "20px" }}
            >
              <div
                style={{
                  width: 400,
                  height: 450,
                  overflow: "hidden",
                  borderRadius: "12px",
                  border: "2px solid #ccc",
                }}
              >
                <img
                  src={persona.imagen}
                  alt={persona.nombres}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              {/* Botón debajo de la imagen */}
              <Button
                variant="contained"
                color="primary"
                style={{ marginTop: "20px" }}
              >
                Descargar en PDF
              </Button>
            </div>

            <TableContainer style={{ width: "400px" }}>
              <Table aria-label="simple table">
                <TableBody>
                  {dataPart2.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.label}</TableCell>
                      <TableCell>{row.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonaIdentificado;