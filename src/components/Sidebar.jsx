import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addClass } from '../redux/actions/classesActions';
import {
  setMode,
  setRelationshipType,
  deleteSelectedElement,
} from '../redux/actions/uiActions';
import {
  Button,
  makeStyles,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@material-ui/core';
import AddBoxIcon from '@material-ui/icons/AddBox';
import DeviceHubIcon from '@material-ui/icons/DeviceHub';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CodeIcon from '@mui/icons-material/Code';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SessionInfo from './SessionInfo';

const useStyles = makeStyles((theme) => ({
  sidebar: {
    width: '300px',
    height: '100%',
    background: 'linear-gradient(180deg, #1E3C72 0%, #2A5298 100%)',
    color: '#ECF0F1',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    boxSizing: 'border-box',
    position: 'absolute',
    top: 0,
    left: 0,
    overflowY: 'auto',
    overflowX: 'hidden',
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'rgba(255,255,255,0.1)',
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'rgba(255,255,255,0.2)',
      borderRadius: '3px',
    },
  },
  sectionTitle: {
    color: '#f8f9fa',
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    margin: '15px 0 10px 0',
    paddingLeft: '10px',
    fontWeight: 600,
  },
  button: {
    marginBottom: '15px',
    width: '100%',
    padding: '12px 20px',
    borderRadius: '50px',
    textTransform: 'none',
    fontSize: '0.95rem',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    color: '#fff',
    overflow: 'hidden',
    position: 'relative',
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:before': {
      content: '""',
      position: 'absolute',
      left: '-50px',
      width: '0',
      height: '0',
      borderTop: '50px solid transparent',
      borderBottom: '50px solid transparent',
      borderRight: '50px solid rgba(255, 255, 255, 0.2)',
      transform: 'translateX(-100%)',
      transition: 'transform 0.5s',
    },
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
      '&:before': {
        transform: 'translateX(0)',
      },
      '& $buttonIcon': {
        animation: '$wiggle 1s infinite',
      },
    },
    '&:active': {
      transform: 'scale(0.98)',
    },
  },

  addButton: {
    background: 'linear-gradient(60deg, #16A085, #F4D03F)',
  },
  relationshipButton: {
    background: 'linear-gradient(60deg, #8E44AD, #3498DB)',
  },
  deleteButton: {
    background: 'linear-gradient(60deg, #E74C3C, #F39C12)',
  },
  utilityButton: {
    background: 'linear-gradient(60deg, #2980B9, #8E44AD)',
  },
  logoutButton: {
    background: 'linear-gradient(60deg, #c0392b, #e74c3c)',
    marginTop: 'auto',
  },
  buttonIcon: {
    marginRight: '15px',
    transition: 'transform 0.3s',
  },
  '@keyframes wiggle': {
    '0%, 100%': { transform: 'rotate(-3deg)' },
    '50%': { transform: 'rotate(3deg)' },
  },
  divider: {
    height: '2px',
    margin: '10px 0',
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
  },
}));

const Sidebar = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState('Python');
  const mode = useSelector((state) => state.ui.mode);
  const selectedElementId = useSelector((state) => state.ui.selectedElementId);
  const classesState = useSelector((state) => state.classes);

  const relationshipTypes = ['Association', 'Inheritance', 'Aggregation', 'Composition'];

  const handleAddClass = () => {
    dispatch(addClass());
    dispatch(setMode('default'));
  };

  const handleAddRelationship = (type) => {
    if (mode === 'addingRelationship') {
      dispatch(setMode('default'));
    } else {
      dispatch(setRelationshipType(type));
      dispatch(setMode('addingRelationship'));
    }
  };

  const handleDelete = () => {
    dispatch(deleteSelectedElement());
  };

  const handleExport = () => {
    // Implement export functionality
  };

  const handleImport = (event) => {
    // Implement import functionality
  };

  const handleGenerateCode = () => {
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleCodeGeneration = () => {
    // Implement code generation
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/auth');
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className={classes.sidebar}>

      <Typography className={classes.sectionTitle}>
        Tools
      </Typography>

      <Button
        className={`${classes.button} ${classes.addButton}`}
        onClick={handleAddClass}
      >
        <AddBoxIcon className={classes.buttonIcon} />
        Add Class
      </Button>

      <Typography className={classes.sectionTitle}>
        Relationships
      </Typography>
      {relationshipTypes.map((type) => (
        <Button
          key={type}
          className={`${classes.button} ${classes.relationshipButton}`}
          onClick={() => handleAddRelationship(type)}
        >
          <DeviceHubIcon className={classes.buttonIcon} />
          Add {type}
        </Button>
      ))}

      <Typography className={classes.sectionTitle}>
        Actions
      </Typography>
      <Button
        className={`${classes.button} ${classes.deleteButton}`}
        onClick={handleDelete}
        disabled={!selectedElementId}
      >
        <DeleteIcon className={classes.buttonIcon} />
        Delete
      </Button>

      <Typography className={classes.sectionTitle}>
        Project
      </Typography>
      <Button
        className={`${classes.button} ${classes.utilityButton}`}
        onClick={handleExport}
        disabled={classesState.allIds.length === 0}
      >
        <SaveIcon className={classes.buttonIcon} />
        Export Diagram
      </Button>

      <Button
        className={`${classes.button} ${classes.utilityButton}`}
        onClick={triggerFileInput}
      >
        <CloudUploadIcon className={classes.buttonIcon} />
        Import Diagram
      </Button>

      <Button
        className={`${classes.button} ${classes.utilityButton}`}
        onClick={handleGenerateCode}
        disabled={classesState.allIds.length === 0}
      >
        <CodeIcon className={classes.buttonIcon} />
        Generate Code
      </Button>

      <Button
        className={`${classes.button} ${classes.logoutButton}`}
        onClick={handleLogout}
      >
        <ExitToAppIcon className={classes.buttonIcon} />
        Logout
      </Button>

      {/* Hidden file input for import */}
      <input
        type="file"
        accept=".json"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleImport}
      />

      {/* Dialog for language selection */}
      <Dialog open={open} onClose={handleDialogClose}>
        <DialogTitle>Select Target Language</DialogTitle>
        <DialogContent>
          <RadioGroup value={language} onChange={handleLanguageChange}>
            <FormControlLabel value="Python" control={<Radio />} label="Python" />
            <FormControlLabel value="Java" control={<Radio />} label="Java" />
            <FormControlLabel value="PHP" control={<Radio />} label="PHP" />
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCodeGeneration} color="primary">
            Generate
          </Button>
        </DialogActions>
      </Dialog>

      <SessionInfo />


    </div>
  );
};

export default Sidebar;

