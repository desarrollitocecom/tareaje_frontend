import React from 'react';
import { Formik, Form } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import fondo_sjl_top from '../../assets/logos/fondo_sjl_top.png';
import fondo_sjl_bottom from '../../assets/logos/fondo_sjl_bottom.png';
import logo from '../../assets/logos/logo_sjl.png';
import { Container, Box, Button, TextField, Paper } from '@mui/material';
import { loginSuccess } from '../../Redux/Slices/AuthSlice';
import CustomSwal from '../../helpers/swalConfig';
import UseLogin from './UseLogin';

const Login = () => {
  const navigate = useNavigate();
  const { loading, error, login, logout } = UseLogin();

  const validate = (values) => {
    const errors = {};
    if (!values.username) {
      errors.username = 'Campo requerido';
    }
    if (!values.password) {
      errors.password = 'Campo requerido';
    } else if (values.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    return errors;
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formattedValues = { usuario: values.username, contraseña: values.password };
      
      // Llama a la función de login del hook
      const response = await login(formattedValues);

      // Si el inicio de sesión es exitoso, se actualiza el estado de Redux
      if (response) {
        resetForm(); // Limpia el formulario
        navigate('/'); // Redirige a la página principal o a donde desees
        CustomSwal.fire({
          icon: 'success',
          title: 'Inicio de sesión exitoso',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 4000
        })
      }else{
        CustomSwal.fire({
          icon: 'error',
          title: error,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 4000
        })
      }

    } catch (error) {
      // Manejo de errores (puedes también actualizar el estado de error en Redux si lo deseas)
      console.error(error);
    } finally {
      setSubmitting(false); // Finaliza el estado de envío
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-cover bg-center relative">
      <div className="flex absolute top-0 left-0 w-1/3 md:w-80 lg:w-96 aspect-square bg-left-top opacity-70 bg-no-repeat bg-cover"
        style={{ backgroundImage: `url(${fondo_sjl_top})` }}>
      </div>
      <div className="flex absolute bottom-0 right-0 w-1/3 md:w-80 lg:w-96 aspect-square bg-right-bottom opacity-70 bg-no-repeat bg-cover"
        style={{ backgroundImage: `url(${fondo_sjl_bottom})` }}>
      </div>
      <Container maxWidth="xs">
        <div className="w-full flex items-center justify-center relative">
          <img
            src={logo}
            alt="logo"
            className="flex w-72 md:w-96 h-auto absolute top-[-150px] md:top-[-180px]" />
        </div>
        <Paper elevation={3} sx={{ padding: 3, borderRadius: 5 }}>
          <Formik
            initialValues={{ username: '', password: '' }}
            validate={validate}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, handleChange, handleBlur, values, errors, touched }) => (
              <Form>
                <Box mb={2}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Nombre de usuario"
                    name="username"
                    value={values.username || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.username && Boolean(errors.username)}
                    helperText={touched.username && errors.username || "Ingrese el nombre de usuario"}
                  />
                </Box>
                <Box mb={2}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Contraseña"
                    name="password"
                    type="password"
                    value={values.password || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password || "La contraseña debe tener al menos 6 caracteres"}
                    autoComplete="new-password"
                  />
                </Box>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={isSubmitting}
                  sx={{ mt: 2 }}
                >
                  Iniciar sesión
                </Button>
              </Form>
            )}
          </Formik>
        </Paper>
      </Container>
    </div>
  );
};

export default Login;