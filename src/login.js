import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import {
  Box,
  Button,
  Checkbox,
  CssBaseline,
  FormControl,
  FormControlLabel,
  FormLabel,
  TextField,
  Typography,
  Card as MuiCard,
  Stack,
  Link,
  Divider,
} from '@mui/material';

// Styled components
const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: '450px',
  margin: 'auto',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow: theme.shadows[3],
}));

const Container = styled(Stack)(({ theme }) => ({
  minHeight: '100vh',
  padding: theme.spacing(2),
  justifyContent: 'center',
  alignItems: 'center',
  background: theme.palette.background.default,
}));

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    try {
      const response = await axios.post('http://127.0.0.1:8000/login', { email, password });
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);

      const profileResponse = await axios.get('http://127.0.0.1:8000/auth/status', {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      const { userId, role } = profileResponse.data;

      onLogin(true, userId, profileResponse.data);
      alert('Login successful');
      localStorage.setItem('isLoggedIn', true);

      // Navigate based on role
      if (role === 'product_manager') {
        navigate('/dashboards/ProductManager');
      } else if (role === 'sales_manager') {
        navigate('/dashboards/smapp');
      } else {
        navigate('/');
      }
    } catch (error) {
      alert(error.response?.data?.detail || 'Login failed');
    }
  };

  const validateInputs = () => {
    let isValid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password || password.length < 1) {
      setPasswordError('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  return (
    <Container>
      <CssBaseline />
      <Card>
        <Typography variant="h4" align="center">
          Login
        </Typography>
        <Box component="form" onSubmit={handleLogin} noValidate>
          <FormControl fullWidth margin="normal">
            <FormLabel>Email</FormLabel>
            <TextField
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!emailError}
              helperText={emailError}
              placeholder="your@email.com"
              variant="outlined"
              required
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <FormLabel>Password</FormLabel>
            <TextField
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!passwordError}
              helperText={passwordError}
              placeholder="••••••••"
              type="password"
              variant="outlined"
              required
            />
          </FormControl>
          <FormControlLabel
            control={<Checkbox color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </Box>
        <Divider sx={{ my: 2 }}>or</Divider>
        <Box>
          <Button fullWidth variant="outlined">
            Login with Google
          </Button>
        </Box>
        <Typography align="center" sx={{ mt: 2 }}>
          Don&apos;t have an account?{' '}
          <Link href="/register" underline="hover">
            Sign up
          </Link>
        </Typography>
      </Card>
    </Container>
  );
};

export default Login;
