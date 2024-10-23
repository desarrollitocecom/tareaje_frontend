import React from 'react';
import { Formik, Form} from 'formik';
import { useNavigate } from 'react-router-dom'; 
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../Redux/Slices/AuthSlice';
import fondo_sjl from '../assets/logos/fondo_sjl.png';
import logo from '../assets/logos/logo_sjl.png';
import fono from '../assets/logos/telefono.jpeg';
import { Container, Box, Button, TextField, Paper } from '@mui/material';

const Login = () => {
  const navigate = useNavigate(); 
  const dispatch = useDispatch();

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
    if (values.username === 'admin' && values.password === 'admin123') {
      dispatch(loginSuccess({ user: { username: 'admin' }, token: 'some-token' }));
      resetForm();
      navigate('/');
    } else {
      alert('Datos incorrectos');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-cover bg-center relative">
      <div className="hidden md:flex absolute w-full h-full bg-cover bg-center opacity-50"
        style={{ backgroundImage: `url(${fondo_sjl})` }}>
      </div>
      <div className="flex md:hidden absolute w-full h-full bg-cover bg-center opacity-50"
        style={{ backgroundImage: `url(${fono})` }}>
      </div>
      <div className="absolute m-20 top-12 transform -translate-y-1/2">
          <img
            src={logo}
            alt="logo"
            className="hidden md:flex w-full h-auto mx-auto opacity-90" />
      </div>
      <Container maxWidth="xs">
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
                    helperText={touched.username && errors.username}
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
                    helperText={touched.password && errors.password}
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
