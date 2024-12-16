import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  makeStyles,
} from '@material-ui/core';

// Import a background image or use a URL
// import backgroundImage from './path-to-your-background-image.jpg'; // Ensure you have an image in your project

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    // backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay for readability
      zIndex: 1,
    },
  },
  container: {
    position: 'relative',
    zIndex: 2, // Ensure the form is above the overlay
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(5),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: '420px',
    background: 'rgba(255, 255, 255, 0.85)', // Semi-transparent background
    borderRadius: theme.shape.borderRadius,
    boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 12px 25px rgba(0,0,0,0.25)',
    },
  },
  title: {
    marginBottom: theme.spacing(3),
    fontWeight: 700,
    color: theme.palette.text.primary,
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textAlign: 'center',
  },
  error: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1),
    background: '#ffe6e6',
    color: '#cc0000',
    borderRadius: theme.shape.borderRadius,
    width: '100%',
    textAlign: 'center',
    fontWeight: 500,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
    animation: '$fadeIn 1s ease-in-out',
  },
  '@keyframes fadeIn': {
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
  textField: {
    marginBottom: theme.spacing(2),
    '& .MuiOutlinedInput-root': {
      borderRadius: theme.shape.borderRadius,
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main,
      },
    },
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    padding: theme.spacing(1.5),
    borderRadius: theme.shape.borderRadius,
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    color: '#fff',
    fontWeight: 600,
    transition: 'background 0.3s ease',
    '&:hover': {
      background: `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
    },
  },
  switchButton: {
    marginTop: theme.spacing(1),
    textTransform: 'none',
    color: theme.palette.primary.main,
    fontWeight: 500,
    '&:hover': {
      textDecoration: 'underline',
      background: 'transparent',
    },
  },
}));

const Auth = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const endpoint = isLogin ? '/api/login' : '/api/register';
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect to editor page
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className={classes.root}>
      <Container component="main" className={classes.container}>
        <Paper elevation={0} className={classes.paper}>
          <Typography component="h1" variant="h4" className={classes.title}>
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </Typography>
          {error && (
            <Typography className={classes.error} variant="body2">
              {error}
            </Typography>
          )}
          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={formData.username}
              onChange={handleChange}
              className={classes.textField}
            />
            {!isLogin && (
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className={classes.textField}
              />
            )}
            <TextField
              variant="outlined"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              className={classes.textField}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className={classes.submit}
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
            <Button
              fullWidth
              className={classes.switchButton}
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin
                ? "Don't have an account? Sign Up"
                : 'Already have an account? Sign In'}
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default Auth;
