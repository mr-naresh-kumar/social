import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Link } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/signup', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" align="center" gutterBottom fontWeight="bold">
            Sign Up
          </Typography>
          {error && <Typography color="error" align="center">{error}</Typography>}
          <form onSubmit={onSubmit}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              margin="normal"
              onChange={onChange}
              required
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              margin="normal"
              onChange={onChange}
              required
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              margin="normal"
              onChange={onChange}
              required
            />
            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{ mt: 3, mb: 2, py: 1.5, borderRadius: 2 }}
            >
              Create Account
            </Button>
            <Box textAlign="center">
              <Link component={RouterLink} to="/login" variant="body2">
                Already have an account? Login
              </Link>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Signup;
