import React, { memo, useEffect, useState } from 'react';
import { IconButton, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress, TableSortLabel, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { SortData } from '../../helpers/GeneralFunctions';
import CustomTablePagination from '../../Pages/Pagination/TablePagination';
import { useLocation } from 'react-router-dom';

const CRUDTable = memo(({
    data = [],
    onDelete = null,
    onEdit = null,
    ArrLookup = [],
    loading = false,
    rowOnClick = null,
    count = 100,
    noDataText = 'No hay datos registrados.',
    filter = false
}) => {
    const headers = data.length > 0
        ? Object.keys(data[0]).filter((key) => key !== 'id' && key !== 'notShow')
        : [];

    const location = useLocation();

    const [orderBy, setOrderBy] = useState('index');
    const [orderDirection, setOrderDirection] = useState('asc');
    const [sortedData, setSortedData] = useState([]);

    const handleSortRequest = (property) => {
        const isAsc = orderBy === property && orderDirection === 'asc';
        setOrderDirection(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    useEffect(() => {
        const dataWithIndex = data.map((item, index) => ({
            ...item,
            index: index + 1, // Agrega el índice (puedes empezar desde 1)
        }));
        setSortedData(SortData(dataWithIndex, orderBy, orderDirection));
    }, [data, orderBy, orderDirection]);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const searchParam = searchParams.get('search'); // Obtén el parámetro de búsqueda 'search'

        if (searchParam && filter) {
            const lowerCaseSearch = searchParam.toLowerCase();
            const filteredData = data.filter((item) =>
                headers.some((key) =>
                    item[key]?.toString().toLowerCase().includes(lowerCaseSearch)
                )
            );
            // Agrega el índice a los datos filtrados
            const filteredDataWithIndex = filteredData.map((item, index) => ({
                ...item,
                index: index + 1, // Reasigna el índice en función del arreglo filtrado
            }));

            setSortedData(SortData(filteredDataWithIndex, orderBy, orderDirection));
        } else {
            // Si no hay búsqueda, muestra todos los datos ordenados
            const dataWithIndex = data.map((item, index) => ({
                ...item,
                index: index + 1,
            }));
            setSortedData(SortData(dataWithIndex, orderBy, orderDirection));
        }
    }, [location.search, data, orderBy, orderDirection]);

    return (
        <div className='flex flex-1 overflow-hidden'>
            {loading ?
                <div className='flex justify-center pt-4 h-full w-full'>
                    <CircularProgress size={30} thickness={5} />
                </div>
                :
                <>
                    {
                        sortedData && sortedData?.length > 0 ? (
                            <div className='flex flex-col w-full'>
                                <div className='flex-1 max-h-full overflow-y-auto'>
                                    <Table size='small' className='text-nowrap'>
                                        <TableHead className='bg-green-600 sticky top-0 z-10'>
                                            <TableRow>
                                                <TableCell
                                                    sx={{ fontWeight: 600 }}
                                                    align={'left'}

                                                >
                                                    <TableSortLabel
                                                        sx={headerStyles}
                                                        align={'left'}
                                                        active={orderBy === 'index'}
                                                        direction={orderBy === 'index' ? orderDirection : 'asc'}
                                                        onClick={() => handleSortRequest('index')}
                                                    >
                                                        #
                                                    </TableSortLabel>
                                                </TableCell>
                                                {headers.map((header) => (
                                                    <TableCell
                                                        key={header}
                                                        sx={{ fontWeight: 600 }}
                                                        align={'left'}

                                                    >
                                                        <TableSortLabel
                                                            active={orderBy === header}
                                                            direction={orderBy === header ? orderDirection : 'asc'}
                                                            onClick={() => handleSortRequest(header)}
                                                            sx={headerStyles}
                                                        >
                                                            {header.charAt(0).toUpperCase() + header.slice(1)}
                                                        </TableSortLabel>
                                                    </TableCell>
                                                ))}
                                                {(typeof onEdit === 'function' || typeof onDelete === 'function') && (
                                                    <TableCell sx={{ fontWeight: 600 }} align={'left'}></TableCell>
                                                )}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {sortedData.map((row) => (
                                                <TableRow
                                                    onClick={(e) => typeof rowOnClick === 'function' && rowOnClick(e, row)}
                                                    className={`${typeof rowOnClick === 'function' ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                                                    key={row.id || row.dni}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell>{row.index}</TableCell>
                                                    {headers.map((header) => {
                                                        const lookup = ArrLookup.find(item => item.key === header);
                                                        const value = lookup ? getValueById(row[header], lookup.obj) : row[header];

                                                        return (
                                                            <TableCell
                                                                key={header}
                                                                align={'left'}
                                                                className='capitalize'
                                                            >
                                                                {/* Verificar si el valor es un arreglo */}
                                                                {Array.isArray(value) ? (
                                                                    value.map((item, index) => (
                                                                        <Tooltip
                                                                            title={item.label}
                                                                            key={index}
                                                                            arrow
                                                                            placement='top'
                                                                            onClick={item.action}
                                                                            className='cursor-pointer text-gray-500'
                                                                        >
                                                                            {item.icon}
                                                                        </Tooltip>
                                                                    ))
                                                                ) : (
                                                                    value
                                                                )}
                                                            </TableCell>
                                                        );
                                                    })}
                                                    {(typeof onEdit === 'function' || typeof onDelete === 'function') && (
                                                        <TableCell align="right">
                                                            {typeof onEdit === 'function' && (
                                                                <IconButton aria-label="edit" size="small"
                                                                    onClick={() => onEdit(row)}
                                                                >
                                                                    <EditIcon fontSize="small" />
                                                                </IconButton>
                                                            )}
                                                            {typeof onDelete === 'function' && (

                                                                <IconButton aria-label="delete" size="small"
                                                                    onClick={() => onDelete(row)}
                                                                >
                                                                    <DeleteIcon fontSize="small" />
                                                                </IconButton>
                                                            )}
                                                        </TableCell>
                                                    )}


                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                                <div className='flex justify-end pt-4'>
                                    <CustomTablePagination count={count} />
                                </div>
                            </div>
                        ) :
                            (
                                <div className='text-center text-sm mt-6 w-full'>
                                    {noDataText}
                                </div>
                            )
                    }

                </>
            }
        </div>
    )
})

export default CRUDTable

const headerStyles = {
    color: 'white',
    '&.Mui-active': {
        color: 'white', // Color cuando está activo
        '& svg': {
            color: 'white !important', // Color del icono SVG cuando está activo
        }
    },
    '&:hover': {
        color: 'white', // Color del texto al hacer hover
        '& svg': {
            color: 'white !important', // Color del icono SVG al hacer hover
        }
    },
    '&:focus': {
        color: 'white', // Color del texto al hacer hover
        '& svg': {
            color: 'white !important', // Color del icono SVG al hacer hover
        }
    }
}