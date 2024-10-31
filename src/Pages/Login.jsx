import React from 'react';
import { Formik, Form } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../Redux/Slices/AuthSlice';
import fondo_sjl_top from '../assets/logos/fondo_sjl_top.png';
import fondo_sjl_bottom from '../assets/logos/fondo_sjl_bottom.png';
import logo from '../assets/logos/logo_sjl.png';
import { Container, Box, Button, TextField, Paper } from '@mui/material';
import CustomSwal from '../helpers/swalConfig';
import UseUsers from '../Components/hooks/UseUsers'; 

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data } = UseUsers(); // Obtener los datos de usuarios

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

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    setSubmitting(false);

    // Verificar las credenciales en el conjunto de datos
    const user = data.find(user => user.username === values.username && user.password === values.password);
    
    if (user) {
      dispatch(loginSuccess({ user: { username: user.username }, token: 'some-token' }));
      resetForm();
      navigate('/');
    } else {
      CustomSwal.fire({
        title: 'Credenciales incorrectas',
        toast: true,
        icon: 'error',
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
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