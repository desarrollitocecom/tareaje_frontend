import React, { memo, useEffect, useState } from 'react';
import { IconButton, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress, TableSortLabel, Stack, Pagination, createTheme, ThemeProvider, TablePagination } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { SortData } from '../../helpers/GeneralFunctions';
import { useLocation, useNavigate } from 'react-router-dom';
import UseUrlParamsManager from '../hooks/UseUrlParamsManager';

const CRUDTable = memo(({
    data = [],
    onDelete = null,
    onEdit = null,
    ArrLookup = [],
    loading = false,
    rowOnClick = null,
    count = 100,
}) => {
    const headers = data.length > 0
        ? Object.keys(data[0]).filter((key) => key !== 'isDisabled')
        : [];

    const { addParams } = UseUrlParamsManager();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const page = parseInt(queryParams.get('page')) || 1;
    const limit = parseInt(queryParams.get('limit')) || 20;

    const [orderBy, setOrderBy] = useState('id');
    const [orderDirection, setOrderDirection] = useState('asc');
    const [sortedData, setSortedData] = useState([]);

    const handleSortRequest = (property) => {
        const isAsc = orderBy === property && orderDirection === 'asc';
        setOrderDirection(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    useEffect(() => {
        setSortedData(SortData(data, orderBy, orderDirection))

    }, [data, orderBy, orderDirection])

    return (
        <div className='flex flex-1 overflow-hidden'>
            {loading ?
                <div className='flex justify-center pt-4 h-full w-full'>
                    <CircularProgress  size={30} thickness={5}/>
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
                                                {headers.map((header, index) => (
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
                                                    key={row.id}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    {headers.map((header, index) => {
                                                        const lookup = ArrLookup.find(item => item.key === header)
                                                        const value = lookup ? getValueById(row[header], lookup.obj) : row[header]
                                                        return (
                                                            <TableCell
                                                                key={header}
                                                                align={'left'}
                                                                className='capitalize '
                                                            >
                                                                {value}
                                                            </TableCell>
                                                        )
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
                                    <TablePagination
                                        className='select-none'
                                        component="div"
                                        count={count}
                                        page={page - 1}
                                        onPageChange={(event, newPage) => {
                                            addParams({ page: newPage + 1, limit });
                                        }}
                                        rowsPerPage={limit}
                                        onRowsPerPageChange={(event) => {
                                            const newLimit = parseInt(event.target.value);
                                            addParams({ page: 1, limit: newLimit });
                                        }}
                                        labelRowsPerPage="Filas por página"
                                        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                                        rowsPerPageOptions={[20, 50, 100]}
                                    />
                                </div>
                            </div>
                        ) :
                            (
                                <div className='text-center text-sm mt-6 w-full'>
                                    No hay datos registrados.
                                </div>
                            )
                    }

                </>
            }
        </div>
    )
})

export default CRUDTable

const themePagination = {
    '& .MuiPaginationItem-root': {
        color: '#16a34a', // Color del texto de los elementos
    },
    '& .MuiPaginationItem-root.Mui-selected': {
        backgroundColor: '#16a34a !important', // Color de fondo del elemento seleccionado
        color: '#FFFFFF', // Color del texto del elemento seleccionado
    },
}

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