import React from 'react'
import { Link } from 'react-router-dom';
import { Sidebar as ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import Logo from "../../assets/logos/logo_sjl.png"
import { Fragment, useState } from 'react';
import { Avatar, Box, Button, Popover, Typography } from '@mui/material';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';
import storage from '@mui/icons-material/Storage';
import { useDispatch } from 'react-redux';
import { logout } from '../../Redux/Slices/AuthSlice';
import SearchIcon from '@mui/icons-material/Search';

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
          <div style={{ flex: 1 }}>
            {MenuItems.map((item) => (
              <Menu menuItemStyles={menuItemStyles} key={item.id}>
                <MenuItem
                  component={<Link to={item.link} target={item.target} />}
                  icon={<item.icon />}
                >
                  {item.label}
                </MenuItem>
              </Menu>
            ))}
          </div>

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
      </ProSidebar>
      <div
        className="justify-center items-center absolute cursor-pointer top-[100px] right-[-10px] rounded-full h-6 w-6 bg-[#0098e5] text-white z-10 hidden md:flex"
        onClick={() => setCollapsed(!Collapsed)}
      >
        <ChevronRightRoundedIcon
          className={`transition-transform duration-300 ${Collapsed ? "" : "rotate-180"}`}
        />
      </div>
    </div>
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
