import React from 'react'
import { Link } from 'react-router-dom';
import { Sidebar as ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import Logo from "../../assets/logos/logo_sjl.png"
import { Fragment, useState } from 'react';
import { Avatar, Box, Button, Popover, Tooltip, Typography } from '@mui/material';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';
import storage from '@mui/icons-material/Storage';
import { useDispatch } from 'react-redux';
import { logout } from '../../Redux/Slices/AuthSlice';
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

const Sidebar = ({ toggled, setToggled }) => {
  const dispatch = useDispatch();
  const [Collapsed, setCollapsed] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const userSession = {
    user: {
      name: 'Diego Matute',
      email: 'djcord2024@gmail.com',
      image: 'https://contents.bebee.com/users/id/b7aEe63d2afd43a5ad/avatar-lRUe7.jpg',
    },
  };

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
      link: "/AsistenciaPersonal",
      target: "_self",
    },
    {
      id: 4,
      label: "Seguimiento de Asistencias",
      icon: AssessmentIcon,
      link: "/SeguiminetoAsistencia",
      target: "_self",
    },
    {
      id: 5,
      label: 'Base de datos',
      icon: storage,
      link: '/personal',
      target: '_self'
    },
    {
      id: 6,
      label: 'Administración',
      children: [
        {
          id: 1,
          label: 'Gestión de usuarios',
          icon: PersonAddIcon,
          children: [
            { id: 1, label: 'Roles', icon: AdminPanelSettingsIcon, link: '/Roles', target: '_self' },
            { id: 2, label: 'Usuarios', icon: PeopleIcon, link: '/celular/sin-señal', target: '_self' },
          ]
        },
        {
          id: 2,
          label: 'Gestión de Empleados',
          icon: GroupsIcon,
          children: [
            { id: 1, label: 'Empleado', icon: FolderSharedIcon, link: '/celular', target: '_self' },
            { id: 2, label: 'Cargo', icon: WorkIcon, link: '/celular/desactivados', target: '_self' },
            { id: 3, label: 'Sexo', icon: WcIcon, link: '/celular/sin-señal', target: '_self' },
            { id: 4, label: 'Grado de Estudio', icon: SchoolIcon, link: '/celular', target: '_self' },
            { id: 5, label: 'Subgerencia', icon: BusinessIcon, link: '/celular/sin-señal', target: '_self' },
            { id: 6, label: 'Función', icon: TaskIcon, link: '/celular/sin-señal', target: '_self' },
          ]
        },
        {
          id: 3,
          label: 'Gestión de Tiempo Laboral:',
          icon: HourglassEmptyIcon,
          children: [
            { id: 1, label: 'Turno', icon: ScheduleIcon, link: '/celular', target: '_self' },
            { id: 2, label: 'Régimen Laboral', icon: GavelIcon, link: '/celular/desactivados', target: '_self' },
            { id: 3, label: 'Vacaciones', icon: BeachAccessIcon, link: '/celular/sin-señal', target: '_self' },
            { id: 4, label: 'Descansos', icon: WeekendIcon, link: '/celular', target: '_self' },
            { id: 5, label: 'Feriados', icon: EventIcon, link: '/celular/desactivados', target: '_self' },
            { id: 6, label: 'Justificaciones', icon: AssignmentIcon, link: '/celular/sin-señal', target: '_self' },
          ]
        },
        {
          id: 4,
          label: 'Ubicación y Jurisdicción',
          icon: MapIcon,
          children: [
            { id: 1, label: 'Jurisdicción', icon: PublicIcon, link: '/celular', target: '_self' },
            { id: 2, label: 'Lugar de Trabajo', icon: LocationOnIcon, link: '/celular/desactivados', target: '_self' },
          ]
        },
      ],
    }
  ]

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
              MenuItems.map((item) => (
                item.children ? (
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
                src={userSession.user.image}
                alt={userSession.user.name}

                sx={{
                  width: Collapsed ? 30 : 50,
                  height: Collapsed ? 30 : 50,
                  transition: 'width 0.5s, height 0.5s'
                }}
              />
              {!Collapsed && (
                <Box ml={2} flexGrow={1}>
                  <Typography variant="body1" fontWeight="bold" noWrap>
                    {userSession.user.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" noWrap>
                    {userSession.user.email}
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
                  src={userSession.user.image}
                  alt={userSession.user.name}
                  sx={{ width: 50, height: 50, mb: 1 }}

                />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
                  {userSession.user.name}
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', color: 'textSecondary', mb: 1 }}>
                  {userSession.user.email}
                </Typography>
                <Button
                  variant="contained"
                  sx={{ fontSize: 12, fontWeight: 'bold', textTransform: 'capitalize', padding: '8px 16px' }}
                  color="success"
                  startIcon={<LogoutIcon />}
                  onClick={() => dispatch(logout())}
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
