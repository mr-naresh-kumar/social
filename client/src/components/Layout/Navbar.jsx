import React from 'react';
import { AppBar, Toolbar, Typography, InputBase, Box, IconButton, Avatar, Button } from '@mui/material';
import { Search as SearchIcon, Notifications, DarkMode, LightMode, Menu as MenuIcon } from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { useNavigate, Link } from 'react-router-dom';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius * 5,
  backgroundColor: theme.palette.mode === 'light' ? alpha(theme.palette.common.white, 1) : alpha(theme.palette.common.white, 0.15),
  border: theme.palette.mode === 'light' ? '1px solid #e0e0e0' : '1px solid #444',
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#757575'
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '30ch',
      '&:focus': {
        width: '40ch',
      },
    },
  },
}));

const Navbar = ({ toggleColorMode, mode }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <AppBar position="sticky" color="inherit" elevation={1}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" component={Link} to="/" sx={{ textDecoration: 'none', color: 'primary.main', fontWeight: 'bold' }}>
          Social
        </Typography>

        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase placeholder="Search promotions, users," inputProps={{ 'aria-label': 'search' }} />
        </Search>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton color="default" onClick={toggleColorMode}>
            {mode === 'dark' ? <LightMode /> : <DarkMode />}
          </IconButton>
          <IconButton color="default">
            <Notifications />
          </IconButton>
          {user ? (
            <>
              <IconButton component={Link} to="/profile" sx={{ p: 0 }}>
                <Avatar src={user.profilePicture} sx={{ width: 32, height: 32 }} />
              </IconButton>
              <Button onClick={handleLogout} color="inherit">Logout</Button>
            </>
          ) : (
            <Button component={Link} to="/login" variant="contained">Login</Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
