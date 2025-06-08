import { Box } from '@mui/material';
import { SideBar } from './SideBar';
import { NavBar } from './NavBar';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <SideBar />
      <Box sx={{ flexGrow: 1 }}>
        <NavBar />
        <Box component="main" sx={{ p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};