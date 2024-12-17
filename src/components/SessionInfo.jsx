import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  makeStyles,
  Paper,
} from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';

const useStyles = makeStyles((theme) => ({
  sessionInfo: {
    height: "auto",
    padding: theme.spacing(0.5),
    marginBottom: theme.spacing(1),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.shape.borderRadius,
  },
  codeContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(0.5),
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: theme.shape.borderRadius,
    marginTop: theme.spacing(0.5),
  },
  code: {
    fontFamily: 'monospace',
    color: '#fff',
    fontSize: '1.1rem',
  },
  copyButton: {
    color: '#fff',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
}));

const SessionInfo = () => {
  const classes = useStyles();
  const { sessionId } = useParams();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(sessionId);
  };

  return (
    <Paper className={classes.sessionInfo}>
      <Typography variant="subtitle1" style={{ color: '#fff' }}>
        Session Code
      </Typography>
      <Box className={classes.codeContainer}>
        <Typography className={classes.code}>{sessionId}</Typography>
        <Tooltip title="Copy session code">
          <IconButton
            size="small"
            className={classes.copyButton}
            onClick={handleCopyCode}
          >
            <FileCopyIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Paper>
  );
};

export default SessionInfo; 