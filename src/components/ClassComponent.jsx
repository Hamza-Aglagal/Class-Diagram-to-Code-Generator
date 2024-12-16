import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Draggable from 'react-draggable';
import {
  Card,
  CardContent,
  TextField,
  Typography,
  makeStyles,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import {
  updateClassPosition,
  updateClassName,
  addAttribute,
  updateAttribute,
  deleteAttribute,
  addMethod,
  updateMethod,
  deleteMethod,
} from '../redux/actions/classesActions';
import { setSelectedElement } from '../redux/actions/uiActions';

const useStyles = makeStyles({
  classCard: {
    position: 'absolute',
    width: '220px',
    maxHeight: '300px',
    overflowY: 'auto',
    cursor: 'move',
    userSelect: 'none',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    borderRadius: '8px',
    border: '1px solid #ddd',
  },
  header: {
    backgroundColor: '#2c3e50',
    color: '#ecf0f1',
    padding: '8px',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '1.1em',
  },
  body: {
    padding: '8px',
    backgroundColor: '#f9f9f9',
  },
  section: {
    borderTop: '1px solid #e0e0e0',
    padding: '8px',
    backgroundColor: '#fdfdfd',
  },
  selected: {
    border: '2px solid #2980b9',
    boxShadow: '0 0 8px rgba(41, 128, 185, 0.5)',
  },
  addButton: {
    marginTop: '8px',
    backgroundColor: '#2980b9',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#1f5f85',
    },
  },
  formControl: {
    minWidth: 120,
    margin: '8px 0',
  },
  editContainer: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: '8px',
    borderRadius: '6px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
  },
  listItem: {
    paddingLeft: '8px',
    paddingRight: '8px',
    backgroundColor: '#fff',
    marginBottom: '4px',
    borderRadius: '4px',
    border: '1px solid #e0e0e0',
  },
  iconButton: {
    padding: '6px',
    color: '#c0392b',
    '&:hover': {
      color: '#922b21',
    },
  },
});

const visibilityOptions = ['public', 'private', 'protected'];
const typeOptions = ['int', 'String', 'float', 'double', 'boolean', 'char', 'long'];

const ClassComponent = ({ data, setIsDragging, onClick }) => {


  const classes = useStyles();
  const dispatch = useDispatch();
  const selectedElementId = useSelector((state) => state.ui.selectedElementId);
  const isSelected = selectedElementId === data.id;

  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(data.name);

  // For attributes
  const [editingAttributeId, setEditingAttributeId] = useState(null);
  const [attributeEdits, setAttributeEdits] = useState({});

  // For methods
  const [editingMethodId, setEditingMethodId] = useState(null);
  const [methodEdits, setMethodEdits] = useState({});

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragStop = (e, position) => {
    setIsDragging(false);
    dispatch(updateClassPosition(data.id, position.x, position.y));
  };

  const handleNameDoubleClick = (e) => {
    e.stopPropagation();
    setEditingName(true);
  };

  const handleNameBlur = () => {
    dispatch(updateClassName(data.id, name));
    setEditingName(false);
  };

  const handleSelect = (e) => {
    e.stopPropagation();
    dispatch(setSelectedElement(data.id));
  };

  // Attribute Handlers
  const handleAddAttribute = (e) => {
    e.stopPropagation();
    dispatch(addAttribute(data.id));
  };

  const handleAttributeDoubleClick = (e, attribute) => {
    e.stopPropagation();
    setEditingAttributeId(attribute.id);
    setAttributeEdits(attribute);
  };

  const handleAttributeChange = (field, value) => {
    setAttributeEdits({ ...attributeEdits, [field]: value });
  };

  const handleAttributeSave = () => {
    dispatch(updateAttribute(data.id, editingAttributeId, attributeEdits));
    setEditingAttributeId(null);
  };

  const handleDeleteAttribute = (e, attributeId) => {
    e.stopPropagation();
    dispatch(deleteAttribute(data.id, attributeId));
  };

  // Method Handlers
  const handleAddMethod = (e) => {
    e.stopPropagation();
    dispatch(addMethod(data.id));
  };

  const handleMethodDoubleClick = (e, method) => {
    e.stopPropagation();
    setEditingMethodId(method.id);
    setMethodEdits(method);
  };

  const handleMethodChange = (field, value) => {
    setMethodEdits({ ...methodEdits, [field]: value });
  };

  const handleMethodSave = () => {
    dispatch(updateMethod(data.id, editingMethodId, methodEdits));
    setEditingMethodId(null);
  };

  const handleDeleteMethod = (e, methodId) => {
    e.stopPropagation();
    dispatch(deleteMethod(data.id, methodId));
  };

  return (
    <Draggable
      position={{ x: data.position.x, y: data.position.y }}
      onStart={handleDragStart}
      onStop={handleDragStop}
    >
      <Card
        className={`${classes.classCard} ${isSelected ? classes.selected : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        {/* Header - Class Name */}
        <div className={classes.header} onDoubleClick={handleNameDoubleClick}>
          {editingName ? (
            <TextField
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleNameBlur}
              placeholder="Class Name"
              autoFocus
              fullWidth
            />
          ) : (
            <Typography variant="h6">{data.name}</Typography>
          )}
        </div>

        <CardContent
          className={classes.section}
          onDoubleClick={(e) => handleAddAttribute(e)}
        >
          {data.attributes.map((attribute) =>
            editingAttributeId === attribute.id ? (
              <div
                key={attribute.id}
                className={classes.editContainer}
                onDoubleClick={(e) => e.stopPropagation()}
              >
                <TextField
                  value={attributeEdits.name}
                  onChange={(e) =>
                    handleAttributeChange('name', e.target.value)
                  }
                  placeholder="Name"
                  autoFocus
                  fullWidth
                />
                <FormControl className={classes.formControl}>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={attributeEdits.type}
                    onChange={(e) =>
                      handleAttributeChange('type', e.target.value)
                    }
                  >
                    {typeOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                  <InputLabel>Visibility</InputLabel>
                  <Select
                    value={attributeEdits.visibility || ''}
                    onChange={(e) =>
                      handleAttributeChange('visibility', e.target.value)
                    }
                  >
                    {visibilityOptions.map((visibility) => (
                      <MenuItem key={visibility} value={visibility}>
                        {visibility}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAttributeSave}
                  size="small"
                >
                  Save
                </Button>
              </div>
            ) : (
              <div
                key={attribute.id}
                className={classes.attributeLine}
                onDoubleClick={(e) => handleAttributeDoubleClick(e, attribute)}
              >
                <span className={classes.attributeText}>
                  {`${
                    attribute.visibility === 'public'
                      ? '+'
                      : attribute.visibility === 'protected'
                      ? '#'
                      : '-'
                  } ${attribute.name}: ${attribute.type}`}
                </span>
                <IconButton
                  edge="end"
                  className={classes.iconButton}
                  onClick={(e) => handleDeleteAttribute(e, attribute.id)}
                  size="small"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </div>
            )
          )}
        </CardContent>

        {/* Methods Section */}
        <CardContent
          className={classes.section}
          onDoubleClick={(e) => handleAddMethod(e)}
        >
          {data.methods.map((method) =>
            editingMethodId === method.id ? (
              <div
                key={method.id}
                className={classes.editContainer}
                onDoubleClick={(e) => e.stopPropagation()}
              >
                <TextField
                  value={methodEdits.name}
                  onChange={(e) => handleMethodChange('name', e.target.value)}
                  placeholder="Name"
                  autoFocus
                  fullWidth
                />
                <FormControl className={classes.formControl}>
                  <InputLabel>Return Type</InputLabel>
                  <Select
                    value={methodEdits.returnType}
                    onChange={(e) =>
                      handleMethodChange('returnType', e.target.value)
                    }
                  >
                    {typeOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                  <InputLabel>Visibility</InputLabel>
                  <Select
                    value={methodEdits.visibility}
                    onChange={(e) =>
                      handleMethodChange('visibility', e.target.value)
                    }
                  >
                    {visibilityOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleMethodSave}
                  size="small"
                >
                  Save
                </Button>
              </div>
            ) : (
              <div
                key={method.id}
                className={classes.methodLine}
                onDoubleClick={(e) => handleMethodDoubleClick(e, method)}
              >
                <span className={classes.methodText}>
                  {`${
                    method.visibility === 'public'
                      ? '+'
                      : method.visibility === 'protected'
                      ? '#'
                      : '-'
                  } ${method.name}(): ${method.returnType}`}
                </span>
                <IconButton
                  edge="end"
                  className={classes.iconButton}
                  onClick={(e) => handleDeleteMethod(e, method.id)}
                  size="small"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </div>
            )
          )}
        </CardContent>
      </Card>
    </Draggable>
  );
};

export default ClassComponent;
