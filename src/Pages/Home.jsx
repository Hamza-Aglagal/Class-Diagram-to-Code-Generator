import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { createSession } from '../redux/actions/sessionActions';
import {
  Container,
  Typography,
  Button,
  TextField,
  Box,
  Card,
  CardContent,
  makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(4),
    gap: theme.spacing(3),
  },
  title: {
    marginBottom: theme.spacing(4),
  },
  joinSection: {
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'center',
    marginBottom: theme.spacing(4),
  },
  sessionsList: {
    width: '100%',
    maxWidth: 800,
  },
  sessionCard: {
    marginBottom: theme.spacing(2),
    '&:hover': {
      boxShadow: theme.shadows[4],
    },
  },
  button: {
    padding: theme.spacing(1.5, 4),
    fontSize: '1.1rem',
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    color: 'white',
    '&:hover': {
      background: 'linear-gradient(45deg, #1976D2 30%, #1CA7D2 90%)',
    },
  },
}));

const Home = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sessions, setSessions] = useState([]);
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        setError('Please login first');
        return;
      }
      const response = await axios.get(`http://localhost:5000/api/session/user/${user.id}`);
      setSessions(response.data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setError('Error loading sessions');
    }
  };

  const handleCreateNewSession = async () => {
    try {
      console.log('Creating new session...');
      const sessionId = await dispatch(createSession());
      console.log('Session created:', sessionId);
      navigate(`/editor/${sessionId}`);
    } catch (error) {
      console.error('Error creating session:', error);
      setError('Failed to create new session');
    }
  };

  const handleJoinSession = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await axios.post('http://localhost:5000/api/session/join', {
        sessionId: joinCode,
        userId: user.id
      });
      navigate(`/editor/${joinCode}`);
    } catch (error) {
      console.error('Error joining session:', error);
      setError('Invalid session code');
    }
  };

  return (
    <Container className={classes.container}>
      <Typography variant="h3" className={classes.title}>
        UML Editor Dashboard
      </Typography>

      {error && (
        <Typography color="error" variant="body1">
          {error}
        </Typography>
      )}

      <Button
        variant="contained"
        className={classes.button}
        onClick={handleCreateNewSession}
      >
        Create New Diagram
      </Button>

      <Box className={classes.joinSection}>
        <TextField
          variant="outlined"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
          placeholder="Enter session code"
          error={!!error && error.includes('session code')}
          helperText={error && error.includes('session code') ? error : ''}
        />
        <Button
          variant="contained"
          className={classes.button}
          onClick={handleJoinSession}
          disabled={!joinCode}
        >
          Join Session
        </Button>
      </Box>

      <Box className={classes.sessionsList}>
        <Typography variant="h5" gutterBottom>
          Your Sessions
        </Typography>
        {sessions.map((session) => (
          <Card key={session.sessionId} className={classes.sessionCard}>
            <CardContent>
              <Typography variant="h6">{session.name}</Typography>
              <Typography variant="body2" color="textSecondary">
                Created: {new Date(session.createdAt).toLocaleDateString()}
              </Typography>
              <Button
                variant="contained"
                className={classes.button}
                onClick={() => navigate(`/editor/${session.sessionId}`)}
              >
                Open
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default Home;
