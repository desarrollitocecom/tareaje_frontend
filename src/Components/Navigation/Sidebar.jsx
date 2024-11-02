import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';
import { Sidebar as ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import Logo from "../../assets/logos/logo_sjl.png"
import { Fragment, useState } from 'react';
import ProfileUser from '../../assets/logos/userimg.png';
import { Avatar, Box, Button, Popover, Tooltip, Typography } from '@mui/material';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';
import storage from '@mui/icons-material/Storage';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, logout } from '../../Redux/Slices/AuthSlice';
import SearchIcon from '@mui/icons-material/Search';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import EventIcon from '@mui/icons-material/Event';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import WeekendIcon from '@mui/icons-material/Weekend';
import WorkIcon from '@mui/icons-material/Work';
import ScheduleIcon from '@mui/icons-material/Schedule';
import GavelIcon from '@mui/icons-material/Gavel';
import WcIcon from '@mui/icons-material/Wc';
import SchoolIcon from '@mui/icons-material/School';
import BusinessIcon from '@mui/icons-material/Business';
import TaskIcon from '@mui/icons-material/Task';
import PublicIcon from '@mui/icons-material/Public';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupsIcon from '@mui/icons-material/Groups';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import MapIcon from '@mui/icons-material/Map';
import { formatFirstNameLastName, hasPermissionFunction } from '../../helpers/GeneralFunctions';
import UseLogin from '../../Pages/Login/UseLogin';
import CustomSwal from '../../helpers/swalConfig';

const Sidebar = ({ toggled, setToggled }) => {
  const dispatch = useDispatch();
  const [Collapsed, setCollapsed] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, refresh, token } = useSelector((state) => state.auth);
  const { getUserData } = UseLogin()

  const LogOut = () => {
    dispatch(logout());
    CustomSwal.fire({
      icon: "info",
      title: 'Se ha cerrado la sesion',
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true,
    })
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUserData(token);

        dispatch(loginSuccess({ user: userData, token: token }));
      } catch (error) {
        LogOut();
        console.error("Error fetching user data:", error);
      }
    };

    fetchData()

  }, [refresh])


  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const MenuItems = [
    {
      id: 1,
      label: "Inicio",
      icon: DashboardIcon,
      link: "/",
      target: "_self",
    },
    {
      id: 2,
      label: "Buscar Personal",
      icon: SearchIcon,
      link: "/buscar",
      target: "_self",
    },
    {
      id: 3,
      label: "Asistencia Personal",
      icon: PeopleIcon,
      link: "/asistencia-personal",
      target: "_self",
      requiresPermission: "asistencia"
    },
    {
      id: 4,
      label: "Seguimiento de Asistencias",
      icon: AssessmentIcon,
      link: "/seguimineto-asistencia",
      target: "_self",
      requiresPermission: "asistencia"
    },
    {
      id: 5,
      label: 'Base de datos',
      icon: storage,
      link: '/base-datos',
      target: '_self',
      requiresPermission: "asistencia"
    },
    {
      id: 6, requiresPermission: "rol", 
      label: 'Administración',
      children: [
        {
          id: 1,
          label: 'Gestión de usuarios',
          icon: PersonAddIcon,
          children: [
            { id: 1, label: 'Roles', icon: AdminPanelSettingsIcon, link: '/roles', target: '_self', requiresPermission: "rol" },
            { id: 2, label: 'Usuarios', icon: PeopleIcon, link: '/usuarios', target: '_self', requiresPermission: "usuario" },
          ]
        },
        {
          id: 2,
          label: 'Gestión de Empleados',
          icon: GroupsIcon,
          children: [
            { id: 1, label: 'Empleado', icon: FolderSharedIcon, link: '/empleado', target: '_self', requiresPermission: "empleado" },
            { id: 2, label: 'Cargo', icon: WorkIcon, link: '/cargo', target: '_self', requiresPermission: "cargo" },
            { id: 3, label: 'Sexo', icon: WcIcon, link: '/sexo', target: '_self', requiresPermission: "sexo" },
            { id: 4, label: 'Grado de Estudio', icon: SchoolIcon, link: '/grado-estudio', target: '_self', requiresPermission: "gradoDeEstudio" },
            { id: 5, label: 'Subgerencia', icon: BusinessIcon, link: '/subgerencia', target: '_self', requiresPermission: "subgerencia" },
            { id: 6, label: 'Función', icon: TaskIcon, link: '/funcion', target: '_self', requiresPermission: "funcion" },
          ]
        },
        {
          id: 3,
          label: 'Gestión de Tiempo Laboral',
          icon: HourglassEmptyIcon,
          children: [
            { id: 1, label: 'Turno', icon: ScheduleIcon, link: '/turno', target: '_self', requiresPermission: "turno" },
            { id: 2, label: 'Régimen Laboral', icon: GavelIcon, link: '/regimen-laboral', target: '_self', requiresPermission: "regimenLaboral" },
            { id: 3, label: 'Vacaciones', icon: BeachAccessIcon, link: '/vacaciones', target: '_self', requiresPermission: "vacacion" },
            { id: 4, label: 'Descansos', icon: WeekendIcon, link: '/descansos', target: '_self', requiresPermission: "descanso" },
            { id: 5, label: 'Feriados', icon: EventIcon, link: '/feriados', target: '_self', requiresPermission: "feriado" },
            { id: 6, label: 'Justificaciones', icon: AssignmentIcon, link: '/justificaciones', target: '_self', requiresPermission: "justificacion" },
          ]
        },
        {
          id: 4,
          label: 'Ubicación y Jurisdicción',
          icon: MapIcon,
          children: [
            { id: 1, label: 'Jurisdicción', icon: PublicIcon, link: '/jurisdiccion', target: '_self', requiresPermission: "jurisdiccion" },
            { id: 2, label: 'Lugar de Trabajo', icon: LocationOnIcon, link: '/lugar-trabajo', target: '_self', requiresPermission: "lugarDeTrabajo" },
          ]
        },
      ],
    }
  ]

  const filterMenuItems = (items) => 
    items.reduce((acc, { children, requiresPermission, ...rest }) => {
      // Si no tiene requiresPermission o tiene permiso, lo agregamos
      if (!requiresPermission || hasPermissionFunction(user, requiresPermission)) {
        const item = { ...rest };
        // Si tiene hijos, filtramos recursivamente
        if (children) {
          const filteredChildren = filterMenuItems(children);
          if (filteredChildren.length) item.children = filteredChildren; // Solo agregar si hay hijos filtrados
        }
        acc.push(item);
      }
      return acc;
    }, []);
  
  
  // Uso de la función
  const filteredMenuItems = filterMenuItems(MenuItems);
  

  return (
    <div className="relative h-full w-max bg-slate-500 z-[1200]">
      <ProSidebar
        backgroundColor="#ffffff"
        className="shadow h-full"
        breakPoint="md"
        collapsed={Collapsed}
        toggled={toggled}
        onBackdropClick={() => setToggled(false)}
        rootStyles={{
          color: themes.light.sidebar.color,
        }}
      >
        <div className="flex flex-col h-full">
          <Link
            to={"/"}
            className="flex justify-center items-center h-[90px]"
            style={{ marginBottom: "24px", marginTop: "16px" }}
          >
            <img src={Logo} alt="Logo reducido" className="w-full max-w-[230px]" />
          </Link>
          <div style={{ flex: 1 }} className='max-h-full overflow-hidden overflow-y-auto'>
            {
              filteredMenuItems.map((item) => (
                item.children  ? (
                  <Fragment key={item.id} >
                    <div style={{ padding: '0 24px', marginBottom: '8px', marginTop: '32px' }}>
                      <Typography
                        variant="body2"
                        className='text-nowrap flex items-center gap-1'
                        fontWeight={600}
                        style={{ opacity: Collapsed ? 0 : 0.7, letterSpacing: '0.5px' }}
                      >
                        {item.icon && <item.icon />}{item.label}
                      </Typography>
                    </div>
                    <Menu menuItemStyles={menuItemStyles}>
                      {item.children?.map((child) => (
                        child.children ? (
                          <SubMenu key={child.id} label={child.label} icon={child.icon && <child.icon />}>
                            {child.children?.map((child) => (
                              <MenuItem key={child.id} className='bg-white' component={<Link to={child.link} target={child.target} />} icon={child.icon && <child.icon />}>
                                {child.label}
                              </MenuItem>
                            ))}
                          </SubMenu>
                        ) : (
                          <MenuItem key={child.id} component={<Link to={child.link} target={child.target} />} icon={child.icon && <child.icon />}>
                            {child.label}
                          </MenuItem>
                        )
                      ))}
                    </Menu>
                  </Fragment>
                )
                  :
                  (
                    <Menu key={item.id} menuItemStyles={menuItemStyles}>
                      <MenuItem component={<Link to={item.link} target={item.target} />} icon={item.icon && <item.icon />}>
                        {item.label}
                      </MenuItem>
                    </Menu>
                  )
              ))
            }
          </div>

          <div>
            {/* Pie de página con la información del usuario */}
            <div
              className="flex items-center justify-center p-4 border-t w-full cursor-pointer"
              style={{ flexDirection: Collapsed ? 'column' : 'row' }}
              onClick={handlePopoverOpen}
            >
              <Avatar
                src={user.image || ProfileUser}
                alt={`${formatFirstNameLastName(user.empleado.nombres, user.empleado.apellidos)}`}

                sx={{
                  width: Collapsed ? 30 : 50,
                  height: Collapsed ? 30 : 50,
                  transition: 'width 0.5s, height 0.5s'
                }}
              />
              {!Collapsed && (
                <Box ml={2} flexGrow={1}>
                  <Typography variant="body1" fontWeight="bold" noWrap>
                    {`${formatFirstNameLastName(user.empleado.nombres, user.empleado.apellidos)}`}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" noWrap>
                    {user.correo}
                  </Typography>
                </Box>
              )}
            </div>

            {/* Popover para mostrar opciones de usuario */}
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handlePopoverClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <Box p={2} display="flex" flexDirection="column" alignItems="center">
                <Avatar
                  src={user.image || ProfileUser}
                  alt={`${formatFirstNameLastName(user.empleado.nombres, user.empleado.apellidos)}`}
                  sx={{ width: 50, height: 50, mb: 1 }}

                />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
                  {`${formatFirstNameLastName(user.empleado.nombres, user.empleado.apellidos)}`}
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', color: 'textSecondary', mb: 1 }}>
                  {user.correo}
                </Typography>
                <Button
                  variant="contained"
                  sx={{ fontSize: 12, fontWeight: 'bold', textTransform: 'capitalize', padding: '8px 16px' }}
                  color="success"
                  startIcon={<LogoutIcon />}
                  onClick={LogOut}
                >
                  Cerrar Sesión
                </Button>

              </Box>
            </Popover>
          </div>
        </div>
      </ProSidebar >
      <div
        className="justify-center items-center absolute cursor-pointer top-[100px] right-[-10px] rounded-full h-6 w-6 bg-[#0098e5] text-white z-10 hidden md:flex"
        onClick={() => setCollapsed(!Collapsed)}
      >
        <ChevronRightRoundedIcon
          className={`transition-transform duration-300 ${Collapsed ? "" : "rotate-180"}`}
        />
      </div>
    </div >
  );
};

export default Sidebar;

const themes = {
  light: {
    sidebar: {
      backgroundColor: "#ffffff",
      color: "#607489",
    },
    menu: {
      menuContent: "#fbfcfd",
      icon: "#0098e5",
      hover: {
        backgroundColor: "#c5e4ff",
        color: "#44596e",
      },
      disabled: {
        color: "#9fb6cf",
      },
    },
  },
};

const menuItemStyles = {
  root: {
    fontSize: "13px",
    fontWeight: 400,
  },
  icon: {
    color: themes.light.menu.icon,
  },
  SubMenuExpandIcon: {
    color: "#b6b7b9",
  },
  subMenuContent: {
    backgroundColor: "transparent",
  },
  button: {
    "&:hover": {
      backgroundColor: themes.light.menu.hover.backgroundColor,
      color: themes.light.menu.hover.color,
    },
  },
  label: {
    fontWeight: 600,
  },
};
