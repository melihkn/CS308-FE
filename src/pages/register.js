import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Container, Typography, CssBaseline, Snackbar, Alert} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material';
import { tokens } from '../theme';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    middlename: '',
    surname: '',
    email: '',
    password: '',
    phone_number: '',
  });
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/register', formData);
      setSnackbar({
        open: true,
        message: 'Registration successful',
        severity: 'success',
      });
      navigate('/');
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.detail || 'Register failed',
        severity: 'error',
      });
      setFormData({
        name: '',
        middlename: '',
        surname: '',
        email: '',
        password: '',
        phone_number: '',
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.palette.background.default,
      }}
    >
      <CssBaseline />
      <Box
        sx={{
          p: 4,
          backgroundColor: theme.palette.background.paper,
          borderRadius: 2,
          boxShadow: 3,
          width: '100%',
          maxWidth: 400,
        }}
      >
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          Register
        </Typography>
        <Box component="form" onSubmit={handleRegister}>
          {[
            { id: 'name', label: 'Name', required: true },
            { id: 'middlename', label: 'Middle Name (Optional)', required: false },
            { id: 'surname', label: 'Surname', required: true },
            { id: 'email', label: 'Email Address', type: 'email', required: true },
            { id: 'password', label: 'Password', type: 'password', required: true },
            { id: 'phone_number', label: 'Phone Number (Optional)', type: 'tel', required: false },
          ].map(({ id, label, type = 'text', required }) => (
            <TextField
              key={id}
              margin="normal"
              fullWidth
              id={id}
              label={label}
              name={id}
              autoComplete={id}
              type={type}
              required={required}
              value={formData[id]}
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor:
                      theme.palette.mode === 'dark'
                        ? colors.blueAccent[200] // Dark mode için border rengi
                        : 'rgba(0, 0, 0, 0.23)', // Light mode için border rengi
                  },
                  '&:hover fieldset': {
                    borderColor:
                      theme.palette.mode === 'dark'
                        ? colors.grey[700] // Dark mode hover rengi
                        : 'rgba(0, 0, 0, 0.87)', // Light mode hover rengi
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: colors.blueAccent[100], // Tema ana rengi
                    borderWidth: '2px', // Focus olduğunda border kalınlığı
                  },
                },
                input: {
                  color: theme.palette.text.primary, // Yazı rengini temaya göre ayarla
                },
                '& .MuiInputLabel-root': {
                  color: theme.palette.text.secondary, // Label rengini temaya göre ayarla
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: colors.blueAccent[100], // Focus durumunda label rengi
                },
              }}
            />
          ))}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
        </Box>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Register;
