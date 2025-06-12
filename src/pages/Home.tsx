import { Button, Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <Box sx={{ p: 3, maxWidth: 600, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>Банковское API</Typography>
      
      <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
        <Button 
          component={Link} 
          to="/login" 
          variant="contained" 
          size="large"
        >
          Вход
        </Button>
        
        <Button 
          component={Link} 
          to="/register" 
          variant="contained" 
          size="large"
        >
          Регистрация
        </Button>
        
        <Button 
          component={Link} 
          to="/accounts" 
          variant="contained" 
          size="large"
        >
          Управление счетами
        </Button>
      </Box>
    </Box>
  );
}