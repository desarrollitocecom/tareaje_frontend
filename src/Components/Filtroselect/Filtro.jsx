import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';

const Filtro = ({ label, placeholder, name, value, onChange, onBlur, options, error, touched }) => {
  return (
    <Box>
      <FormControl
        fullWidth
        variant="outlined"
        size="small"
        className="bg-white"
        error={touched && Boolean(error)}
      >

        <InputLabel
          id={`${name}-label`}
          shrink={true}
        >
          {label}
        </InputLabel>
        <Select
          labelId={`${name}-label`}
          label={label}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          displayEmpty
          MenuProps={{
            PaperProps: {
              style: {
                marginTop: 3,
                maxHeight: 300, // Altura máxima del menú desplegable
              },
            },
          }}
          sx={{ fontSize: '0.9rem' }} // Reducir tamaño del texto del Select
        >
          <MenuItem defaultChecked value="" sx={{ fontSize: '0.9rem' }}> {/* Reducir tamaño de las opciones */}
            <em>{placeholder || 'Seleccione una opción'}</em>
          </MenuItem>
          {options.map((option) => (
            <MenuItem
              key={option.id || option.value} // Asigna un key único basado en `id` o `value`
              value={option.value}
              sx={{ fontSize: '0.9rem' }}
            >
              {option.label || option.valor} {/* Usa `label` como texto, o `valor` si está definido */}
            </MenuItem>
          ))}
        </Select>
        {touched && error && <FormHelperText error>{error}</FormHelperText>}
      </FormControl>
    </Box>
  );
};

export default Filtro;
