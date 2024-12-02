import React, { useEffect, useState } from 'react'
import CustomModal from '../../Components/Modal/CustomModal';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { Button, FormControl, FormHelperText, MenuItem, Select } from '@mui/material';
import { useFormik } from 'formik';
import dayjs from 'dayjs';
import useFetch from '../../Components/hooks/useFetch';
import { useSelector } from 'react-redux';
import CustomSwal, { swalError } from '../../helpers/swalConfig';

const AddAsistencia = ({ SelectedAsistencia, setRefreshData }) => {
  const [Open, setOpen] = useState(false)
  const { postData } = useFetch()
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (SelectedAsistencia) {
      setOpen(true);
      formik.setFieldValue('id_empleado', SelectedAsistencia.id_empleado);
      formik.setFieldValue('fecha', SelectedAsistencia.fecha);
      formik.setFieldValue('hora', dayjs().format('HH:mm:ss'));
    }
  }, [SelectedAsistencia])

  const handleClose = () => {
    setOpen(false);
    formik.resetForm();
  }

  const formik = useFormik({
    initialValues: {
      id_empleado: '',
      fecha: null,
      hora: null,
      estado: '',
    },
    validate: (values) => {
      const errors = {};
      if (!values.estado) {
        errors.estado = 'Este campo es obligatorio';
      }
      if (!values.hora) {
        errors.hora = 'Este campo es obligatorio';
      }
      if (!values.fecha) {
        errors.fecha = 'Este campo es obligatorio';
      }
      return errors;
    },
    onSubmit: (values) => {
      postData(`${import.meta.env.VITE_APP_ENDPOINT}/asistencias/create/`, values, token)
        .then((res) => {
          if (res.status) {
            CustomSwal.fire(
              'Agregado',
              'La asistencia ha sido agregado correctamente.',
              'success'
            );
            handleClose();
            setRefreshData((prev) => !prev);
          } else {
            throw res.error;
          }
        })
        .catch((err) => {
          swalError(err.response.data);
          console.error(err);
        }).finally(() => {
          formik.setSubmitting(false);
        });
    }
  })

  return (
    <CustomModal Open={Open} handleClose={handleClose} isLoading={formik.isSubmitting}>
      <div className="flex items-center mb-2">
        <h1 className='text-lg font-bold fl'>Crear Asistencia</h1>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className='grid grid-cols-2 gap-4'>
          <div className='flex flex-col text-sm'>
            <label>Fecha</label>
            <DatePicker
              value={formik.values.fecha ? dayjs(formik.values.fecha) : null}
              onChange={(newValue) => {
                formik.setFieldValue('fecha', newValue ? dayjs(newValue).format('YYYY-MM-DD') : '');
              }}
              slotProps={{
                textField: {
                  helperText: formik.touched.fecha && formik.errors.fecha || 'Fecha de asistencia',
                  error: formik.touched.fecha && Boolean(formik.errors.fecha),
                },
              }}
              sx={{
                '& .MuiInputBase-root': {
                  fontSize: '0.875rem',
                  height: '2.5rem',
                },
              }}
            />
          </div>
          <div className='flex flex-col text-sm'>
            <label>Hora</label>
            <TimePicker
              value={formik.values.hora ? dayjs(formik.values.hora, 'HH:mm:ss') : null}
              onChange={(newValue) => {
                formik.setFieldValue('hora', newValue ? dayjs(newValue).format('HH:mm:ss') : '');
              }}
              slotProps={{
                textField: {
                  helperText: formik.touched.hora && formik.errors.hora || 'Hora de asistencia',
                  error: formik.touched.hora && Boolean(formik.errors.hora),
                },
              }}
              views={['hours', 'minutes', 'seconds']}
              sx={{
                '& .MuiInputBase-root': {
                  fontSize: '0.875rem',
                  height: '2.5rem',
                },
              }}
            />
          </div>
          <div className='flex flex-col text-sm'>
            <label htmlFor="estado">Estado</label>
            <FormControl error={formik.touched.estado && Boolean(formik.errors.estado)}>
              <Select
                name="estado"
                id="estado"
                size='small'
                value={formik.values.estado}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.estado && Boolean(formik.errors.estado)}
                displayEmpty
              >
                <MenuItem value="">Seleccione un estado</MenuItem>
                <MenuItem value="A">Asistio</MenuItem>
                <MenuItem value="F">Falto</MenuItem>
              </Select>
              <FormHelperText>{formik.touched.estado && formik.errors.estado || 'Estado de la asistencia'}</FormHelperText>
            </FormControl>
          </div>
        </div>
        <div className="flex justify-between pt-5">
          <Button
            type="button"
            size="small"
            variant="contained"
            color="inherit"
            onClick={handleClose}
          >
            Cerrar
          </Button>
          <Button
            type="submit"
            size="small"
            variant="contained"
            color="success"
            disabled={formik.isSubmitting}
          >
            Enviar
          </Button>
        </div>
      </form>
    </CustomModal>
  )
}

export default AddAsistencia

