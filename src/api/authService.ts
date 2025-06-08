import axios from 'axios';

const API_URL = 'http://localhost:8443/api/auth';

const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Важно для CORS с куками
  headers: {
    'Content-Type': 'application/json'
  }
});

export const authService = {
  login: (credentials: { email: string; password: string }) => 
    instance.post('/login', credentials)
      .then(response => {
            if (response.data.accessToken && response.data.refreshToken) {
              localStorage.setItem('accessToken', response.data.accessToken);
              localStorage.setItem('refreshToken', response.data.refreshToken);
            }
            return response;
          })
          .catch(error => {
            console.error('Registration error:', error.response?.data);
            throw error;
      }),
    
  register: (userData: { username: string; password: string; email: string; phone: string }) =>
    instance.post('/registration', userData) 
      .then(response => {
        if (response.data.accessToken && response.data.refreshToken) {
          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
        return response;
      })
      .catch(error => {
        console.error('Registration error:', error.response?.data);
        throw error;
      }),
      
  refreshToken: () => {
    const refreshToken = localStorage.getItem('refreshToken');
  
    instance.post('/refresh_token', null, {
      headers: {
        'X-Refresh-Token': refreshToken
      },
    })
    .then(response => {
      const newAccessToken = response.data.accessToken;
      const newRefreshToken = response.data.refresh_token;
      
      if (newAccessToken) {
        localStorage.setItem('accessToken', newAccessToken);
      }
      if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken);
      }
      
      return response;
    })
    .catch(error => {
      console.error('Refresh error:', error.response?.data);
      if (error.response?.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
      throw error;
    });
  }
};