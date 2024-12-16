import React from 'react';
import Sidebar from '../components/Sidebar';
import DiagramEditor from '../components/DiagramEditor';
import { makeStyles } from '@material-ui/core';
import CodeViewer from '../components/CodeViewer';

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
