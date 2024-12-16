import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/auth');
  };

  return (
    <Button
      variant="contained"
      color="secondary"
      startIcon={<ExitToAppIcon />}
      onClick={handleLogout}
      style={{ position: 'absolute', top: '10px', right: '10px' }}
    >
      Logout
    </Button>
  );
};

export default LogoutButton; 