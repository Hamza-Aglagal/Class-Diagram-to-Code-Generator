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
    width: '200px',
    cursor: 'move',
    userSelect: 'none',
    backgroundColor: '#fff',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    borderRadius: '4px',
  },
  header: {
    backgroundColor: '#424242', // Dark grey instead of blue
    color: '#fff',
    padding: '5px',
    textAlign: 'center',
    borderTopLeftRadius: '4px',
    borderTopRightRadius: '4px',
  },
  body: {
    padding: '5px',
  },
  section: {
    borderTop: '1px solid #e0e0e0',
    padding: '5px',
  },
  selected: {
    border: '2px solid #ff9800', // Orange border for selected state
  },
  addButton: {
    marginTop: '5px',
  },
  formControl: {
    minWidth: 120,
    marginRight: '10px',
  },
  editContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  listItem: {
    paddingLeft: '0',
    paddingRight: '0',
  },
  iconButton: {
    padding: '4px',
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
          <List dense>
            {data.attributes.map((attribute) => (
              <ListItem
                key={attribute.id}
                className={classes.listItem}
                onDoubleClick={(e) => handleAttributeDoubleClick(e, attribute)}
              >
                {editingAttributeId === attribute.id ? (
                  <div className={classes.editContainer}>
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
                        value={attributeEdits.visibility}
                        onChange={(e) =>
                          handleAttributeChange('visibility', e.target.value)
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
                      onClick={handleAttributeSave}
                    >
                      Save
                    </Button>
                  </div>
                ) : (
                  <>
                    <ListItemText
                      primary={`${attribute.visibility === 'public' ? '+' : '-'
                        } ${attribute.name}: ${attribute.type}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        className={classes.iconButton}
                        onClick={(e) => handleDeleteAttribute(e, attribute.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </>
                )}
              </ListItem>
            ))}
          </List>
        </CardContent>

        {/* Methods Section */}
        <CardContent
          className={classes.section}
          onDoubleClick={(e) => handleAddMethod(e)}
        >
          <List dense>
            {data.methods.map((method) => (
              <ListItem
                key={method.id}
                className={classes.listItem}
                onDoubleClick={(e) => handleMethodDoubleClick(e, method)}
              >
                {editingMethodId === method.id ? (
                  <div className={classes.editContainer}>
                    <TextField
                      value={methodEdits.name}
                      onChange={(e) =>
                        handleMethodChange('name', e.target.value)
                      }
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
                    >
                      Save
                    </Button>
                  </div>
                ) : (
                  <>
                    <ListItemText
                      primary={`${method.visibility === 'public' ? '+' : '-'
                        } ${method.name}(): ${method.returnType}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        className={classes.iconButton}
                        onClick={(e) => handleDeleteMethod(e, method.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </>
                )}
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Draggable>
  );
};

export default ClassComponent;
