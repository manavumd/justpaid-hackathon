import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Box,
} from '@mui/material';
import { UserContext } from '../context/UserContext';
import { signOut } from '../utils/auth';

const Header = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileRedirect = () => {
    handleMenuClose();
    navigate('/profile');
  };

  const handleAvailabiltyRedirect = () => {
    handleMenuClose();
    navigate('/availability');
  };

  const handleDashboardRedirect = () => {
    handleMenuClose();
    if (user?.role === 'business') {
      navigate('/dashboard/business');
    } else if (user?.role === 'expert') {
      navigate('/dashboard/expert');
    }
  };

  const handleSignOut = () => {
    signOut(setUser);
    handleMenuClose();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {/* App Name */}
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          Finder Service
        </Typography>

        {/* Search for Experts Button for Business Users */}
        {isAuthenticated && user?.role === 'business' && (
          <Button
            color="inherit"
            onClick={() => navigate('/')}
            sx={{ marginRight: 2 }}
          >
            Search for Experts
          </Button>
        )}

        {/* User Menu (Avatar with Dropdown) */}
        {isAuthenticated ? (
          <Box display="flex" alignItems="center">
            <IconButton onClick={handleMenuOpen} sx={{ ml: 2 }}>
              <Avatar
                src={user?.profile?.profile_photo} // Use profile photo if available
                alt={`${user?.first_name} ${user?.last_name}`}
              >
                {/* Fallback to initials */}
                {user?.first_name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem>
                {user?.first_name} {user?.last_name}
              </MenuItem>
              <MenuItem onClick={handleDashboardRedirect}>My Dashboard</MenuItem>
              {user?.role === 'expert' && (
                <MenuItem onClick={handleProfileRedirect}>Manage Profile</MenuItem>
              )}
              {user?.role === 'expert' && (
                <MenuItem onClick={handleAvailabiltyRedirect}>Manage Availability</MenuItem>
              )}
              <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
            </Menu>
          </Box>
        ) : (
          <Button color="inherit" onClick={() => navigate('/login')}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
