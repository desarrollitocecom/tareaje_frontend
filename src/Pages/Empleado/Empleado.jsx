import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import CRUDTable from '../../Components/Table/CRUDTable';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import SearchIcon from '@mui/icons-material/Search';
import { FormControl, InputAdornment, InputLabel, Input, IconButton, Tooltip } from '@mui/material';
import AddEmpleado from './AddEmpleado';
import EditEmpleado from './EditEmpleado';
import deleteEmpleado from './DeleteEmpleado';
import usePermissions from '../../Components/hooks/usePermission';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import useFetch from '../../Components/hooks/useFetch';
import UseUrlParamsManager from '../../Components/hooks/UseUrlParamsManager';
import SearchInput from '../../Components/Inputs/SearchInput';

const Empleados = ({ moduleName }) => {
    const { canCreate, canDelete, canEdit } = usePermissions(moduleName);
    const location = useLocation();
    const { token } = useSelector((state) => state.auth);
    const { getData, deleteData } = useFetch();
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [update, setUpdate] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState(null);

    const [count, setCount] = useState(0);

    useEffect(() => {
        fetchData(location.search || undefined);
    }, [location.search, update]);


    const refreshData = () => {
        setUpdate((prev) => !prev);
    };

    const fetchData = async (url) => {
        setLoading(true);
        const urlParams = url || '';

        try {
            const response = await getData(`${import.meta.env.VITE_APP_ENDPOINT}/empleados/${urlParams}`, token);
            setCount(response.data.data.totalCount);
            const dataFormated = response.data.data.data.map((item) => ({
                id: item.id,
                nombres: item.nombres,
                apellidos: item.apellidos,
                dni: item.dni,
                celular: item.celular,
                cargo: item.cargo?.nombre || '',
                subgerencia: item.subgerencia?.nombre || 'Sin Subgerencia',
                turno: item.turno?.nombre || 'Sin Turno',
                estado: item.state ? 'Trabajando' : 'Cesado',


            }));

            setData(dataFormated); // Se guarda todo el objeto
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const onEdit = async (id) => {
        try {
            // Obtén los datos del empleado desde el backend
            const response = await getData(`${import.meta.env.VITE_APP_ENDPOINT}/empleados/${id}`, token);
            const empleadoData = response.data.data;

        
            // Establece los datos seleccionados en el estado
            setSelected(empleadoData);
        } catch (error) {
            console.error('Error al obtener los datos del empleado:', error);
        }
    };


    const onDelete = (obj) => {
        deleteEmpleado(obj, refreshData, token, deleteData);
    };

    const StatusButton = ({ estado }) => (
        <span
            style={{
                backgroundColor: estado === "Trabajando" ? 'green' : 'red',
                color: 'white',
                borderRadius: '12px',
                padding: '4px 12px',
                fontWeight: 'bold',
                display: 'inline-block',
            }}
        >
            {estado === "Trabajando" ? 'Trabajando' : 'Cesado'}
        </span>
    );

    return (
        <>
            <div className='h-full flex flex-col w-full bg-gray-100 p-4'>
                <header className="text-white bg-green-700 py-4 px-3 mb-6 w-full rounded-lg flex justify-center relative">
                    <Link onClick={() => navigate(-1)} className='flex items-center gap-1'>
                        <ArrowBackIosNewRoundedIcon className='!size-5 md:!size-6 mt-[0.1rem] absolute left-4' />
                    </Link>
                    <h1 className="md:text-2xl lg:text-4xl font-bold text-center">
                        EMPLEADOS
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
                                    {canCreate && <AddEmpleado refreshData={refreshData} />}
                                </div>
                                <SearchInput />
                            </div>
                        </div>
                        <CRUDTable
                            data={data.map((item) => ({
                                ...item,
                                estado: <StatusButton estado={item.estado} />,
                            }))}
                            loading={loading}
                            onDelete={canDelete ? onDelete : null}
                            onEdit={(obj) => {
                                onEdit(obj.id); // Llamar a onEdit con el ID
                            }}
                            count={count}
                        />
                    </div>
                </main>
            </div>
            {canEdit && <EditEmpleado Selected={selected} setSelected={setSelected} refreshData={refreshData} />}
        </>
    );
};

export default Empleados;
