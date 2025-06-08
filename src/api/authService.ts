import axios from 'axios';

const API_URL = 'http://localhost:8443/api/auth';

export const authService = {
  login: (credentials: { username: string; password: string }) => 
    axios.post(`${API_URL}/login`, credentials),
  register: (userData: { username: string; password: string; email: string, phone: string }) =>
    axios.post(`${API_URL}/register`, userData),
  refresh_token: () => 
    axios.post(`${API_URL}/refresh_token`)
};      