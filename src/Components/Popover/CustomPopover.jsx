import { Button, IconButton, Popover } from '@mui/material';
import React from 'react'
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const CustomPopover = ({ label, CustomIcon, CustomIconClose, children }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    return (
        <>
            <Button
                aria-describedby={id}
                variant="text"
                onClick={handleClick}
                size='small'

                className={`${open ? 'active' : ''} flex items-center`}
                sx={{
                    padding: '3px 10px',
                    textTransform: 'none',
                    '&.active': {
                        backgroundColor: 'primary.main',
                        color: 'white',
                    },
                }}
            >
                {!open ?
                    CustomIcon ?
                        <CustomIcon sx={{ marginRight: '5px', width: '1.1rem', height: '1.1rem' }} />
                        :
                        <FilterListIcon sx={{ marginRight: '5px', width: '1.1rem', height: '1.1rem' }} />
                    :
                    CustomIconClose ?
                        <CustomIconClose sx={{ marginRight: '5px', width: '1.1rem', height: '1.1rem' }} />
                        :
                        <FilterListIcon sx={{ marginRight: '5px', width: '1.1rem', height: '1.1rem' }} />
                }

                <div className='mt-1 hidden lg:block text-nowrap'>
                    {label}
                </div>
            </Button>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                sx={{ marginTop: '10px' }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <div className='p-3 relative'>
                    <IconButton
                        onClick={handleClose}
                        className='!absolute !top-1 !right-1 cursor-pointer z-10'
                    >
                        <CloseRoundedIcon/>
                    </IconButton>

                    {children}
                </div>
            </Popover>
        </>
    )
}

export default CustomPopover