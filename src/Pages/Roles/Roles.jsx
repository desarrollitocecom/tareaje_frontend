import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import CRUDTable from '../../Components/Table/CRUDTable';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import SearchIcon from '@mui/icons-material/Search';
import { FormControl, InputAdornment, InputLabel, Input, IconButton, Tooltip } from '@mui/material';
import AddRol from './AddRol';
import EditRol from './EditRol';
import deleteRole from './DeleteRol';
import usePermissions from '../../Components/hooks/usePermission';
import useFetch from '../../Components/hooks/useFetch';
import { useSelector } from 'react-redux';
import useFetchData from '../../Components/hooks/useFetchData';
import UseUrlParamsManager from '../../Components/hooks/UseUrlParamsManager';
import SearchInput from '../../Components/Inputs/SearchInput';



const Roles = ({ moduleName }) => {
  const { canCreate, canDelete, canEdit } = usePermissions(moduleName);
  const { addParams } = UseUrlParamsManager();
  const { getData, deleteData } = useFetch()
  const { token } = useSelector((state) => state.auth);
  const { fetchPermisos } = useFetchData(token);
  const navigate = useNavigate()
  const location = useLocation();
  const [data, setData] = useState([])
  const [Update, setUpdate] = useState(false)
  const [Loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('');
  const [Selected, setSelected] = useState(null)
  const timeoutRef = useRef(null);
  const [count, setCount] = useState(0);
  const [permisos, setPermisos] = useState([]);
  const [permisosAgrupados, setPermisosAgrupados] = useState([])

  useEffect(() => {
    fetchData(location.search || '');
  }, [location.search, Update])

  useEffect(() => {
    fetchPermisos().then((res) => {
      const permisos = res.data;

      const permisosAgrupados = permisos.reduce((acc, permiso) => {
        // Excluir el permiso 'all_system_access'
        if (permiso.nombre === 'all_system_access') return acc;

        const modulo = permiso.nombre.split('_')[1]; // Obtener el módulo (por ejemplo: "asistencia", "cargo", etc.)

        // Si el módulo no existe en el acumulador, lo inicializamos como un array vacío
        if (!acc[modulo]) {
          acc[modulo] = [];
        }

        // Añadir el permiso al módulo correspondiente
        acc[modulo].push(permiso);

        return acc;
      }, {});

      setPermisos(permisos);
      setPermisosAgrupados(permisosAgrupados);
    });
  }, [])


  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {

      addParams({ search: value.trim() });
      
    }, 800);
  };

  const refreshData = () => {
    setUpdate((prev) => !prev)
  }


  const fetchData = async (urlParams) => {
    setLoading(true)

    try {
      const response = await getData(`${import.meta.env.VITE_APP_ENDPOINT}/auth/rol/${urlParams}`, token)
      setCount(response.data.data.totalCount)
      const dataFormated = response.data.data.data.map((item) => {
        return {
          id: item.id,
          nombre: item.nombre,
          descripción: item.descripcion
        }
      })
      setData(dataFormated)
    } catch (error) {
      console.error(error);

    } finally {
      setLoading(false)
    }
  }

  const onEdit = (obj) => {
    setSelected(obj);

  }
  const onDelete = (obj) => {
    deleteRole(obj, deleteData, token, refreshData)
  }

  return (
    <>
      <div className='h-full flex flex-col w-full bg-gray-100 p-4'>
        <header className="text-white bg-green-700 py-4 px-3 mb-6 w-full rounded-lg flex justify-center relative">
          <Link onClick={() => navigate(-1)} className='flex items-center gap-1'>
            <ArrowBackIosNewRoundedIcon
              className='!size-5 md:!size-6 mt-[0.1rem] absolute left-4'
            />
          </Link>
          <h1 className="md:text-2xl lg:text-4xl font-bold text-center">
            ROLES
          </h1>
        </header>
        <main className='flex-1 bg-white shadow rounded-lg p-4 h-full overflow-hidden'>
          <div className='flex flex-col w-full h-full'>
            <div className='w-full flex flex-col md:flex-row justify-space-between pb-6 gap-3'>
              <div className='w-full flex items-center gap-2'>
                <span className='text-gray-600'>Total de filas: <span id="rowCount" className='font-bold'>{count || 0}</span></span>
              </div>
              <div className='w-full flex items-center justify-end gap-3'>
                <div className='flex items-center'>
                  <Tooltip title="Refrescar" placement='top' arrow>
                    <IconButton aria-label="refresh" onClick={refreshData}>
                      <RefreshRoundedIcon />
                    </IconButton>
                  </Tooltip>
                  {canCreate && <AddRol refreshData={refreshData} permisosAgrupados={permisosAgrupados}/>}
                </div>
                <SearchInput/>
              </div>
            </div>
            <CRUDTable
              data={data}
              loading={Loading}
              onDelete={canDelete ? onDelete : null}
              onEdit={canEdit ? onEdit : null}
              count={count}
              // filter={true}
            />
          </div >
        </main>
      </div>
      {/* Componetnes para editar y eliminar */}
      {canEdit && <EditRol Selected={Selected} setSelected={setSelected} refreshData={refreshData} permisos={permisos} permisosAgrupados={permisosAgrupados} />}
    </>
  )
}

export default Roles