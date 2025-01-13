import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, MenuItem, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: '',
    first_name: '',
    last_name: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('http://localhost:8000/api/users/register/', formData);
      console.log(response.data);
      navigate('/login'); // Redirect to login page
    } catch (error) {
      setError('Registration failed. Please check your inputs and try again.');
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 500,
        mx: 'auto',
        mt: 8,
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: '#f9f9f9',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Create Your Account
      </Typography>
      <Typography variant="body1" gutterBottom>
        Join our platform and start exploring experts today.
      </Typography>
      {error && (
        <Typography color="error" variant="body2" gutterBottom>
          {error}
        </Typography>
      )}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          name="username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <TextField
          label="First Name"
          name="first_name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.first_name}
          onChange={handleChange}
          required
        />
        <TextField
          label="Last Name"
          name="last_name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.last_name}
          onChange={handleChange}
          required
        />
        <TextField
          label="Role"
          name="role"
          select
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <MenuItem value="business">Business</MenuItem>
          <MenuItem value="expert">Expert</MenuItem>
        </TextField>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Register
        </Button>
      </form>
      <Typography variant="body2" sx={{ mt: 2 }}>
        Already have an account?{' '}
        <Link component={RouterLink} to="/login">
          Log in
        </Link>
      </Typography>
    </Box>
  );
};

export default Register;
