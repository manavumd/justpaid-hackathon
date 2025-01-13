import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, Link } from '@mui/material';
import axiosInstance from '../utils/axiosInstance';
import { UserContext } from '../context/UserContext';
import { Link as RouterLink } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('http://localhost:8000/api/users/login/', {
        username: email,
        password,
      });
      const { access, refresh } = response.data;
  
      // Save tokens in localStorage
      localStorage.setItem('token', access);
      localStorage.setItem('refresh_token', refresh);

      const userResponse = await axiosInstance.get('http://localhost:8000/api/users/me/', {
        headers: { Authorization: `Bearer ${access}` },
      });

      const { role } = userResponse.data;
  
      // Set user in context
    //   setUser({ username: email });
      setUser(userResponse.data);

      if (role === 'business') {
        navigate('/');
      } else if (role === 'expert') {
        navigate('/dashboard/expert');
      }

    } catch (error) {
      setError('Invalid credentials. Please try again.');
    }
  };
  

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: 'auto',
        mt: 8,
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      {error && (
        <Typography color="error" variant="body2" gutterBottom>
          {error}
        </Typography>
      )}
      <form onSubmit={handleLogin}>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
      </form>
      <Typography variant="body2" sx={{ mt: 2 }}>
    New User? <Link component={RouterLink} to="/register">Register</Link>
    </Typography>
    </Box>
  );
};

export default Login;
