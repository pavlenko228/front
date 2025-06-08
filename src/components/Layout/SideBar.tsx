import { List, ListItem, ListItemButton, ListItemText, Divider, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const menuItems = [
  { text: 'Главная', path: '/' },
  { text: 'Регистрация', path: '/register' },
  { text: 'Вход', path: '/login' },
  { text: 'Обновить токен', path: '/refreshToken' },
  { text: 'Аккаунты', path: '/accounts' },
  { text: 'Транзакции', path: '/transactions' },
];

export const SideBar = () => {
  return (
    <Box
      sx={{
        width: 240,
        bgcolor: 'primary.dark',
        color: 'white',
        height: '100vh',
        position: 'fixed',
      }}
    >
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              sx={{
                '&:hover': {
                  bgcolor: 'primary.light',
                },
              }}
            >
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default SideBar;