import axios from 'axios';

const API_URL = 'http://localhost:8081/api/auth';

export const authService = {
  login: (credentials: { username: string; password: string }) => 
    axios.post(`${API_URL}/login`, credentials),
  register: (userData: { username: string; password: string; email: string }) =>
    axios.post(`${API_URL}/register`, userData)
};      