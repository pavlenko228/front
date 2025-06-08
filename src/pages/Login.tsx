import { useState } from 'react';
import { authService } from '../api/authService';
import { Container, TextField, Button, Box, Alert } from '@mui/material';


export default function Login() {
  const [loginFormData, setLoginFormData] = useState({
      email: '',
      password: '',
    });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.login(loginFormData);
      setSuccess(true);
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <h1>Login</h1>
      {success ? (
        <Alert severity="success">Login successful!</Alert>
      ) : (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={loginFormData.email}
            onChange={(e) => setLoginFormData({...loginFormData, email: e.target.value})}
          />
          <TextField
            label="Password"
            fullWidth
            margin="normal"
            value={loginFormData.password}
            onChange={(e) => setLoginFormData({...loginFormData, password: e.target.value})}
          />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
        </Box>
      )}
    </Container>
  );
}