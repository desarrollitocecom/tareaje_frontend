import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import SearchInput from '../../Components/Inputs/SearchInput';
import { IconButton, Tooltip } from '@mui/material';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import usePermissions from '../../Components/hooks/usePermission';
import CRUDTable from '../../Components/Table/CRUDTable';
import AddHorario from './AddHorario';
import useFetch from '../../Components/hooks/useFetch';
import { useSelector } from 'react-redux';
import EditHorario from './EditHorario';
import deleteHorario from './DeleteHorario';

const Horarios = (moduleName) => {
    const { canCreate, canDelete, canEdit } = usePermissions(moduleName);
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate()
    const location = useLocation();
    const [count, setCount] = useState(0);
    const [data, setdata] = useState([])
    const [Update, setUpdate] = useState(false)
    const [Loading, setLoading] = useState(false)
    const [Selected, setSelected] = useState(null)
    const { getData, deleteData } = useFetch()

    const refreshData = () => {
        setUpdate((prev) => !prev)
    }

    useEffect(() => {
        fetchData(location.search || undefined);
    }, [location.search, Update])

    const fetchData = async (url) => {
        setLoading(true)

        const urlParams = url || ''

        try {
            const response = await getData(`${import.meta.env.VITE_APP_ENDPOINT}/rangohorarios/${urlParams}`, token)
            setCount(response.data.data.totalCount)
            const dataFormated = response.data.data.data.map((item) => {
                return {
                    id: item.id,
                    nombre: item.nombre,
                    inicio: item.inicio,
                    fin: item.fin,
                    turno: item.turno?.nombre || 'Sin Turno',
                    subgerencia: item.subgerencia?.nombre || 'Sin Subgerencia',
                    notShow: item,
                }

            })            
            setdata(dataFormated)
        } catch (error) {
            console.log(error);
            setdata([])
        } finally {
            setLoading(false)
        }
    }

    const onEdit = (obj) => {
        setSelected(obj.notShow)
        
    }

    const onDelete = (obj) => {
        deleteHorario(obj, refreshData, token, deleteData)
    }
    
    return (
        <div className='h-full flex flex-col w-full bg-gray-100 p-4'>
            <header className="text-white bg-green-700 py-4 px-3 mb-6 w-full rounded-lg flex justify-center relative">
                <Link onClick={() => navigate(-1)} className='flex items-center gap-1'>
                    <ArrowBackIosNewRoundedIcon
                        className='!size-5 md:!size-6 mt-[0.1rem] absolute left-4'
                    />
                </Link>
                <h1 className="md:text-2xl lg:text-4xl font-bold text-center">
                    HORARIOS
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
                                {canCreate && <AddHorario refreshData={refreshData} />}
                            </div>
                            <SearchInput />
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
                </div>
            </main>
            {canEdit && <EditHorario Selected={Selected} setSelected={setSelected} refreshData={refreshData} />}
        </div>
    )
}

export default Horarios