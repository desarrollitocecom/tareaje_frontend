import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import CRUDTable from '../../Components/Table/CRUDTable';
import axios from 'axios';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import SearchIcon from '@mui/icons-material/Search';
import { FormControl, InputAdornment, InputLabel, Input, IconButton, Tooltip } from '@mui/material';
import AddRol from './AddRol';
import CustomFiltrer from '../../Components/Popover/CustomFiltrer';
import EditRol from './EditRol';
import deleteRole from './DeleteRol';
import usePermissions from '../../Components/hooks/usePermission';
import useFetch from '../../Components/hooks/useFetch';
import { useSelector } from 'react-redux';



const Roles = ({ moduleName }) => {
  const { canCreate, canDelete, canEdit } = usePermissions(moduleName);
  const { getData, deleteData } = useFetch()
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate()
  const location = useLocation();
  const [data, setData] = useState([])
  const [Update, setUpdate] = useState(false)
  const [Loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('');
  const [Selected, setSelected] = useState(null)
  const timeoutRef = useRef(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetchData(location.search || undefined);
  }, [location.search, Update])


  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {

      console.log('Realizando búsqueda con:', value);  // Ejecutar Fetch de busqueda
    }, 800);
  };
  
  const refreshData = () => {
    setUpdate((prev) => !prev)
  }


  const fetchData = async() => {
    setLoading(true)

    try {
      const response = await getData(`${import.meta.env.VITE_APP_ENDPOINT}/auth/rol`, token)
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
      
    }finally{
      setLoading(false)
    }
  }

  const onEdit = (obj) => {
    setSelected(obj);

  }
  const onDelete = (obj) => {
    deleteRole(obj, refreshData)
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
                <span className='text-gray-600'>Total de filas: <span id="rowCount" className='font-bold'>{data ? data.length : 0}</span></span>
              </div>
              <div className='w-full flex items-center justify-end gap-3'>
                <div className='flex items-center'>
                  <Tooltip title="Refrescar" placement='top' arrow>
                    <IconButton aria-label="refresh" onClick={refreshData}>
                      <RefreshRoundedIcon />
                    </IconButton>
                  </Tooltip>
                  {canCreate && <AddRol />}
                </div>
                <FormControl variant="standard" size='small' className='w-full max-w-full md:max-w-sm'>
                  <InputLabel htmlFor="input-with-icon-adornment">
                    Buscar
                  </InputLabel>
                  <Input
                    id="input-with-icon-adornment"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    startAdornment={
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </div>
            </div>
            <CRUDTable
              data={data}
              loading={Loading}
              onDelete={canDelete ? onDelete : null}
              onEdit={canEdit ? onEdit : null}
            />
          </div >
        </main>
      </div>
      {/* Componetnes para editar y eliminar */}
      {canEdit && <EditRol Selected={Selected} setSelected={setSelected} />}

    </>
  )
}

export default Roles