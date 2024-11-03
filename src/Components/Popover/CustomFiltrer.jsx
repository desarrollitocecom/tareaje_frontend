import { Checkbox, FormControlLabel, IconButton, Popover, Tooltip } from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList';
import React, { useState } from 'react'

const CustomFiltrer = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const id = open ? 'filter-popover' : undefined;

    const handleFilterClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleFilterClose = () => {
        setAnchorEl(null);
    };
    return (
        <>
            <Tooltip title="Filtrar" placement='top' arrow>
                <IconButton aria-label="filter" aria-describedby={id} onClick={handleFilterClick}>
                    <FilterListIcon />
                </IconButton>
            </Tooltip>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleFilterClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <div style={{ padding: '10px' }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                size='small'
                            />
                        }
                        label="Activos"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                size='small'
                            />
                        }
                        label="Inactivos"
                    />
                </div>
            </Popover>
        </>
    )
}

export default CustomFiltrer