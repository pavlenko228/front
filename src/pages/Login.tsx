import { Container } from '@mui/material';
import LoginForm from '../components/auth/LoginForm';

export default function Login() {
  return (
    <Container maxWidth="sm">
      <h1>Login</h1>
      <LoginForm />
    </Container>
  );
}