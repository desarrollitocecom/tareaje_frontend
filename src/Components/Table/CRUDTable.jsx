import React, { memo, useEffect, useState } from 'react';
import { IconButton, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress, TableSortLabel, Stack, Pagination, createTheme, ThemeProvider, TablePagination } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { SortData } from '../../helpers/GeneralFunctions';
import { useLocation, useNavigate } from 'react-router-dom';

const CRUDTable = memo(({
    data = [],
    onDelete = null,
    onEdit = null,
    ArrLookup = [],
    loading = false,
    rowOnClick = null,
    limitRows = 20,
    count = 0,
}) => {
    const headers = data.length > 0
        ? Object.keys(data[0]).filter((key) => key !== 'isDisabled')
        : [];


    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const page = parseInt(queryParams.get('page')) || 0;
    const limit = parseInt(queryParams.get('limit')) || limitRows;

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
        <>
            {loading ?
                <div className='flex justify-center pt-4 h-full'>
                    <CircularProgress />
                </div>
                :
                <>
                    <div className='max-h-full overflow-auto' style={{ flex: 1 }}>
                        {
                            sortedData && sortedData?.length > 0 ? (
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
                            ) :
                                (
                                    <div className='text-center text-sm mt-6'>
                                        No hay datos registrados.
                                    </div>
                                )
                        }
                    </div>
                    <div className='flex justify-end pt-4'>
                        <TablePagination
                            className='select-none'
                            component="div"
                            count={count}
                            page={page}
                            onPageChange={(event, newPage) => {
                                navigate(`?page=${newPage}&limit=${limit}`);
                            }}
                            rowsPerPage={limit}
                            onRowsPerPageChange={(event) => {
                                const newLimit = parseInt(event.target.value);
                                navigate(`?page=0&limit=${newLimit}`);
                            }}
                            labelRowsPerPage="Filas por página"
                            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                            rowsPerPageOptions={[20, 50, 100]}
                        />
                    </div>
                </>
            }
        </>
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