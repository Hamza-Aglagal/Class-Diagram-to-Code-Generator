import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addClass } from '../redux/actions/classesActions';
import {
  setMode,
  setRelationshipType,
  deleteSelectedElement,
} from '../redux/actions/uiActions';
import { Button, makeStyles } from '@material-ui/core';
import AddBoxIcon from '@material-ui/icons/AddBox';
import DeviceHubIcon from '@material-ui/icons/DeviceHub';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CodeIcon from '@mui/icons-material/Code';


import { exportDiagram } from '../utils/exportDiagram';
import { importDiagram } from '../utils/importDiagram';
import { exportDiagramAsImage } from '../utils/exportDiagram';
import { generateCode } from '../utils/generateCode';
import JSZip from 'jszip';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button as MuiButton,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  sidebar: {
    width: '100%',
    padding: '20px',
    backgroundColor: '#FFFFFF',
    borderRight: '1px solid #DDDDDD',
    height: '100vh',
    boxSizing: 'border-box',
    boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
  },
  button: {
    marginBottom: '15px',
    width: '100%',
    textTransform: 'none',
    boxShadow: 'none',
    borderRadius: '8px',
    fontSize: '16px',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    color: '#FFFFFF',
    '&:hover': {
      backgroundColor: '#45A049',
    },
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  },
  relationshipButton: {
    backgroundColor: '#9E9E9E',
    color: '#FFFFFF',
    '&:hover': {
      backgroundColor: '#757575',
    },
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  },
  activeRelationshipButton: {
    backgroundColor: '#616161',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    color: '#FFFFFF',
    '&:hover': {
      backgroundColor: '#D32F2F',
    },
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  },
}));




const Sidebar = () => {

  
  const classes = useStyles();
  const dispatch = useDispatch();
  const selectedElementId = useSelector((state) => state.ui.selectedElementId);
  const mode = useSelector((state) => state.ui.mode);
  const relationshipTypes = ['Association', 'Inheritance', 'Aggregation', 'Composition'];

  const classesState = useSelector((state) => state.classes);
  const relationshipsState = useSelector((state) => state.relationships);
  const diagramRef = useSelector((state) => state.ui.diagramRef);

  const fileInputRef = useRef();

  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState('Python');

  const handleAddClass = () => {
    dispatch(addClass());
  };

  const handleAddRelationship = (type) => {
    dispatch(setRelationshipType(type));
    dispatch(setMode('addingRelationship'));
  };

  const handleDelete = () => {
    if (selectedElementId) {
      dispatch(deleteSelectedElement());
    }
  };

  const handleExport = async () => {
    if (classesState.allIds.length === 0) {
      alert('There are no classes in the diagram to export.');
      return;
    }

    const zip = new JSZip();

    // Export JSON data
    const json = exportDiagram(classesState, relationshipsState);
    zip.file('diagram.json', json);

    // Export Image
    if (diagramRef && diagramRef.current) {
      try {
        const blob = await exportDiagramAsImage(diagramRef.current);
        zip.file('diagram.png', blob);
      } catch (error) {
        console.error('Failed to export diagram as image:', error);
        alert('Failed to export diagram as image.');
        return;
      }
    } else {
      alert('Diagram not available for image export.');
      return;
    }

    // Generate ZIP and trigger download
    zip.generateAsync({ type: 'blob' }).then((content) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'diagram.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };



  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Read the file
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          importDiagram(dispatch, data);
        } catch (error) {
          alert('Failed to parse diagram file.');
        }
      };
      reader.readAsText(file);
    }
  };



  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleGenerateCode = () => {
    if (classesState.allIds.length === 0) {
      alert('There are no classes to generate code from.');
      return;
    }
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  const handleCodeGeneration = () => {
    setOpen(false);
    try {
      const code = generateCode(
        { classes: classesState, relationships: relationshipsState },
        language
      );

      const blob = new Blob([code], { type: 'text/plain' });
      const link = document.createElement('a');
      link.download = `diagram.${getFileExtension(language)}`;
      link.href = window.URL.createObjectURL(blob);
      link.click();
    } catch (error) {
      console.error('Code generation failed:', error);
      alert('Failed to generate code.');
    }
  };



  function getFileExtension(language) {
    switch (language) {
      case 'Python':
        return 'py';
      case 'Java':
        return 'java';
      case 'PHP':
        return 'php';
      default:
        return 'txt';
    }
  }


  
  return (
    <div className={classes.sidebar}>
      <Button
        variant="contained"
        startIcon={<AddBoxIcon />}
        className={`${classes.button} ${classes.addButton}`}
        onClick={handleAddClass}
      >
        Add Class
      </Button>

      {relationshipTypes.map((type) => (
        <Button
          key={type}
          variant="contained"
          startIcon={<DeviceHubIcon />}
          className={`${classes.button} ${classes.relationshipButton} ${
            mode === 'addingRelationship' ? classes.activeRelationshipButton : ''
          }`}
          onClick={() => handleAddRelationship(type)}
        >
          Add {type}
        </Button>
      ))}

      <Button
        variant="contained"
        startIcon={<DeleteIcon />}
        className={`${classes.button} ${classes.deleteButton}`}
        onClick={handleDelete}
        disabled={!selectedElementId}
      >
        Delete
      </Button>

      <Button
        variant="contained"
        color="default"
        startIcon={<SaveIcon />}
        className={classes.button}
        onClick={handleExport}
        disabled={classesState.allIds.length === 0}
      >
        Export Diagram
      </Button>

      <Button
        variant="contained"
        color="default"
        startIcon={<CloudUploadIcon />}
        className={classes.button}
        onClick={triggerFileInput}
      >
        Import Diagram
      </Button>

      <Button
        variant="contained"
        color="default"
        startIcon={<CodeIcon />}
        className={classes.button}
        onClick={handleGenerateCode}
        disabled={classesState.allIds.length === 0}
      >
        Generate Code
      </Button>

      {/* Hidden file input */}
      <input
        type="file"
        accept=".json"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleImport}
      />

      {/* Language Selection Dialog */}
      <Dialog open={open} onClose={handleDialogClose}>
        <DialogTitle>Select Target Language</DialogTitle>
        <DialogContent>
          <RadioGroup value={language} onChange={(e) => setLanguage(e.target.value)}>
            <FormControlLabel value="Python" control={<Radio />} label="Python" />
            <FormControlLabel value="Java" control={<Radio />} label="Java" />
            <FormControlLabel value="PHP" control={<Radio />} label="PHP" />
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={handleDialogClose} color="primary">
            Cancel
          </MuiButton>
          <MuiButton onClick={handleCodeGeneration} color="primary">
            Generate
          </MuiButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Sidebar;
