// @ts-nocheck
import { useState } from 'react';
import { Box, CssBaseline, Toolbar, IconButton, Typography } from '@mui/material';
import { Menu } from '@mui/icons-material';
import Header from '../Header';
import Sidebar from '../Sidebar';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(true);

  const handleDrawerToggle = () => {
    console.log('handleDrawerToggle', mobileOpen);
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header position="fixed" sx={{ zIndex: 99999 }}>
        
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Admin Dashboard
          </Typography>
        
      </Header>
      
      <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
          overflowX: 'hidden',
        }}
      >
        <Toolbar /> {/* Offset content below app bar */}
        {children}
      </Box>
    </Box>
  );
};

export default Layout;