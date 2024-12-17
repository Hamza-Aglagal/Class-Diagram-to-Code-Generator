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
    background: 'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)',
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    boxSizing: 'border-box',
    position: 'absolute',
    top: 0,
    left: 0,
    overflowY: 'auto',
    overflowX: 'hidden',
    boxShadow: '2px 0 20px rgba(0, 0, 0, 0.2)',
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'rgba(255,255,255,0.1)',
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'rgba(255,255,255,0.3)',
      borderRadius: '3px',
    },
  },
  sectionTitle: {
    color: '#89c2d9',
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    margin: '20px 0 15px 0',
    paddingLeft: '10px',
    fontWeight: 600,
    borderLeft: '3px solid #a8dadc',
    animation: '$slideInLeft 0.6s ease-out',
  },
  button: {
    marginBottom: '12px',
    width: '100%',
    padding: '12px 20px',
    borderRadius: '12px',
    textTransform: 'none',
    fontSize: '0.95rem',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    color: '#fff',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
    '&:hover': {
      transform: 'scale(1.03) translateX(5px)',
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      '& $buttonIcon': {
        animation: '$rotate 0.5s ease-in-out',
      },
      '&::before': {
        transform: 'scale(10)',
        opacity: 0,
      },
      boxShadow: '0 0 15px rgba(255, 255, 255, 0.5)',
    },
    '&:active': {
      transform: 'scale(0.97)',
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '5px',
      height: '5px',
      borderRadius: '50%',
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      transform: 'scale(1)',
      opacity: 0,
      transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
  },
  buttonIcon: {
    marginRight: '15px',
    transform: 'scale(1.2)',
    color: '#a8dadc',
  },
  '@keyframes rotate': {
    '0%': { transform: 'rotate(0deg)' },
    '25%': { transform: 'rotate(-15deg) scale(1.2)' },
    '75%': { transform: 'rotate(15deg) scale(1.2)' },
    '100%': { transform: 'rotate(0deg)' },
  },
  '@keyframes slideInLeft': {
    '0%': {
      transform: 'translateX(-50px)',
      opacity: 0,
    },
    '100%': {
      transform: 'translateX(0)',
      opacity: 1,
    },
  },
  '@keyframes fadeInUp': {
    '0%': {
      transform: 'translateY(20px)',
      opacity: 0,
    },
    '100%': {
      transform: 'translateY(0)',
      opacity: 1,
    },
  },
  addButton: {
    animation: '$fadeInUp 0.5s ease-out forwards',
    animationDelay: '0.1s',
  },
  relationshipButton: {
    animation: '$fadeInUp 0.5s ease-out forwards',
    animationDelay: '0.2s',
  },
  deleteButton: {
    animation: '$fadeInUp 0.5s ease-out forwards',
    animationDelay: '0.3s',
  },
  utilityButton: {
    animation: '$fadeInUp 0.5s ease-out forwards',
    animationDelay: '0.4s',
  },
  logoutButton: {
    marginTop: 'auto',
    animation: '$fadeInUp 0.5s ease-out forwards',
    animationDelay: '0.5s',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
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


