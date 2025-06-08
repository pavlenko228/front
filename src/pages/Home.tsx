import React from 'react';
import { useState } from 'react';
import SideBar from '../components/layout/SideBar';
import { authService } from '../api/authService';
import { Alert, Box, Button, Paper, Typography } from '@mui/material';
import { AxiosError } from 'axios';

const Home = () => {

  const [message, setMessage] = useState<{text: string, isError: boolean} | null>(null);

  const handleRefresh = async () => {
    try {
      await authService.refreshToken();
      setMessage({ text: 'Токены успешно обновлены!', isError: false });
    } catch (error) {
      // Типизируем ошибку как AxiosError
      const axiosError = error as AxiosError<{
        message?: string;
      }>;
      
      setMessage({ 
        text: axiosError.response?.data?.message || 
             axiosError.message || 
             'Ошибка обновления токенов', 
        isError: true 
      });
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 4, maxWidth: 900, mx: 'auto', mt: 4 }}>

      
    </Paper>
  );
};

export default Home;