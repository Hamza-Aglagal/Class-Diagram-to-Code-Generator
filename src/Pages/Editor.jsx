import React from 'react';
import Sidebar from '../components/Sidebar';
import DiagramEditor from '../components/DiagramEditor';
import { makeStyles } from '@material-ui/core';
import CodeViewer from '../components/CodeViewer';

const useStyles = makeStyles((theme) => ({
  editorPage: {
    display: 'flex',
    width: '100vw',
    height: '100vh',
    margin: 0,
    padding: 0,
    overflow: 'hidden',
  },
  sidebar: {
    width: '20%',
    backgroundColor: '#2e2e3a',
    color: '#ffffff',
    boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
  },
  diagramEditor: {
    width: '80%',
    backgroundColor: '#ffffff',
    boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.05)',
  },
}));

const Editor = () => {
  const classes = useStyles();
  return (
    <div className={classes.editorPage}>
      <div className={classes.sidebar}>
        <Sidebar />
      </div>
      <div className={classes.diagramEditor}>
        <DiagramEditor />
      </div>
      <div>
        <CodeViewer />
      </div>
    </div>
  );
};

export default Editor;
