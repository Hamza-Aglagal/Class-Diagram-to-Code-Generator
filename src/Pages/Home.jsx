import React from 'react';
import { Button, Typography, Container, Box } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: theme.spacing(4),
  },
  title: {
    color: '#3f3d56',
    fontWeight: 'bold',
    marginBottom: theme.spacing(3),
  },
  button: {
    backgroundColor: '#4caf50',
    color: '#fff',
    padding: theme.spacing(1.5, 4),
    fontSize: '1.2rem',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: '#388e3c',
    },
  },
}));

const Home = () => {
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <Typography variant="h3" className={classes.title} gutterBottom>
        Welcome to UML Editor
      </Typography>
      <Button
        variant="contained"
        className={classes.button}
        component={Link}
        to="/editor"
      >
        Start Editing
      </Button>
    </Container>
  );
};

export default Home;
