import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Sidebar from '../components/Sidebar';
import DiagramEditor from '../components/DiagramEditor';
import CodeViewer from '../components/CodeViewer';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  editorPage: {
    display: 'flex',
    width: '100%',
    height: '100%',
    position: 'fixed',
    top: 0,
    left: 0,
    margin: 0,
    padding: 0,
    overflow: 'hidden',
  },
  sidebar: {
    width: '300px',
    height: '100%',
    flexShrink: 0,
    position: 'relative',
  },
  diagramEditor: {
    flexGrow: 1,
    height: '100%',
    backgroundColor: '#ffffff',
    position: 'relative',
    overflow: 'hidden',
  },
  codeViewer: {
    width: '300px',
    height: '100%',
    position: 'relative',
  }
}));

const Editor = () => {
  const classes = useStyles();
  const { sessionId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    // Set the session ID in the Redux store
    dispatch({ type: 'SET_SESSION_ID', payload: sessionId });

    // Connect the socket
    dispatch({ type: 'CONNECT_SOCKET' });

    // Cleanup on unmount
    return () => {
      dispatch({ type: 'DISCONNECT_SOCKET' });
    };
  }, [dispatch, sessionId]);

  return (
    <div className={classes.editorPage}>
      <div className={classes.sidebar}>
        <Sidebar />
      </div>
      <div className={classes.diagramEditor}>
        <DiagramEditor />
      </div>
      <div className={classes.codeViewer}>
        <CodeViewer />
      </div>
    </div>
  );
};

export default Editor;
