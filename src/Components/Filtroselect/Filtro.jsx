import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';

const Filtro = ({ label, name, value, onChange, onBlur, options, error, touched }) => {
  return (
    <Box>
      <FormControl
        fullWidth
        variant="outlined"
        size="small"
        className="bg-white"
        error={touched && Boolean(error)}
      >
        <InputLabel id={`${name}-label`}>{label}</InputLabel>
        <Select
          labelId={`${name}-label`}
          label={label}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        >
          <MenuItem value="">
            <em>Ninguno</em>
          </MenuItem>
          {options.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.valor}
            </MenuItem>
          ))}
        </Select>
        {touched && error && <FormHelperText error>{error}</FormHelperText>}
      </FormControl>
    </Box>
  );
};

export default Filtro;
