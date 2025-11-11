import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link as RouterLink, useNavigate }  from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
} from '@mui/material';
import PublicIcon from '@mui/icons-material/Public'; // Simple logo

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" elevation={1} color="default">
      <Toolbar>
        <Box
          component={RouterLink}
          to="/"
          sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}
        >
          <PublicIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: 'bold' }}
          >
            SocialFeed
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        {user ? (
          <>
            <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'primary.main' }}>
              {user.username.charAt(0).toUpperCase()}
            </Avatar>
            <Typography sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
              Hi, {user.username}
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={RouterLink} to="/login">
              Login
            </Button>
            <Button
              variant="contained"
              color="primary"
              component={RouterLink}
              to="/signup"
              sx={{ ml: 1 }}
            >
              Sign Up
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;