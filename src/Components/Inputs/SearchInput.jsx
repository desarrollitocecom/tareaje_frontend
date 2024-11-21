import React, { useState, useRef, useEffect } from 'react';
import { FormControl, InputAdornment, InputLabel, Input } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import UseUrlParamsManager from '../hooks/UseUrlParamsManager';
import { v4 as uiu4d } from 'uuid';

const SearchInput = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const timeoutRef = useRef(null);
    const { addParams } = UseUrlParamsManager();
    const inputId = uiu4d();


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

    return (
        <FormControl variant="standard" size='small' className='w-full max-w-full md:max-w-sm'>
            <InputLabel htmlFor={inputId}>
                Buscar
            </InputLabel>
            <Input
                id={inputId}
                value={searchTerm}
                onChange={handleSearchChange}
                startAdornment={
                    <InputAdornment position="start">
                        <SearchIcon />
                    </InputAdornment>
                }
            />
        </FormControl>
    );
};

export default SearchInput;
