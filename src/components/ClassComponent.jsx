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

const useStyles = makeStyles((theme) => ({
  classCard: {
    minWidth: 180,
    maxWidth: 220,
    background: 'linear-gradient(165deg, #ffffff 0%, #f0f7ff 100%)',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
    // border: '1px solid rgba(255, 255, 255, 0.18)',
    // transition: 'all 0.2s ease',
    backdropFilter: 'blur(8px)',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 12px 40px rgba(31, 38, 135, 0.25)',
    },
    cursor: 'move',
    overflow: 'hidden',
  },
  selected: {
    border: '2px solid #6366f1',
    boxShadow: '0 0 25px rgba(99, 102, 241, 0.3)',
    background: 'linear-gradient(165deg, #ffffff 0%, #e0e7ff 100%)',
  },
  header: {
    background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
    color: '#ffffff',
    padding: theme.spacing(0.75),
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '0.9rem',
    textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
    position: 'relative',
    overflow: 'hidden',
    '&:before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
      animation: '$shimmer 2s infinite',
    },
  },
  '@keyframes shimmer': {
    '0%': {
      transform: 'translateX(-100%)',
    },
    '100%': {
      transform: 'translateX(100%)',
    },
  },
  section: {
    padding: theme.spacing(0.75),
    position: 'relative',
  },
  attributesSection: {
    background: 'linear-gradient(135deg, #f8faff 0%, #f1f5ff 100%)',
    borderBottom: '2px solid rgba(99, 102, 241, 0.1)',
  },
  methodsSection: {
    background: 'linear-gradient(135deg, #f1f5ff 0%, #e8eeff 100%)',
  },
  listItem: {
    padding: theme.spacing(0.5),
    margin: theme.spacing(0.25, 0),
    borderRadius: '6px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(5px)',
    border: '1px solid rgba(99, 102, 241, 0.1)',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      transform: 'translateX(4px)',
      boxShadow: '0 2px 6px rgba(99, 102, 241, 0.1)',
    },
  },
  editContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.5),
    padding: theme.spacing(2),
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  },
  formControl: {
    minWidth: 120,
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      '&:hover fieldset': {
        borderColor: '#6366f1',
      },
    },
  },
  iconButton: {
    padding: 4,
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    color: '#6366f1',
    '& .MuiSvgIcon-root': {
      fontSize: '0.9rem',
    },
    '&:hover': {
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      transform: 'rotate(90deg)',
    },
  },
  attributeText: {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '0.75rem',
    color: '#1e293b',
    letterSpacing: '0.3px',
  },
  methodText: {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '0.75rem',
    color: '#1e293b',
    letterSpacing: '0.3px',
  },
  visibilitySymbol: {
    fontWeight: 'bold',
    marginRight: theme.spacing(0.5),
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '16px',
    height: '16px',
    borderRadius: '4px',
    fontSize: '10px',
    // background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    color: 'black',
    // boxShadow: '0 1px 3px rgba(99, 102, 241, 0.3)',
  },
  sectionDivider: {
    position: 'relative',
    height: '1px',
    background: 'linear-gradient(to right, transparent, #6366f1, transparent)',
    margin: theme.spacing(1, 0),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
  },
  sectionLabel: {
    position: 'absolute',
    padding: '1px 8px',
    color: '#4f46e5',
    fontSize: '0.65rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 1px 4px rgba(99, 102, 241, 0.2)',
    border: '1px solid #6366f1',
    background: 'linear-gradient(135deg, #ffffff 0%, #f5f7ff 100%)',
  },
  addButton: {
    position: 'absolute',
    right: theme.spacing(2),
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#6366f1',
    '&:hover': {
      color: '#4f46e5',
    },
  },
}));

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
          className={`${classes.section} ${classes.attributesSection}`}
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
                        value={attributeEdits.visibility || ''}
                        onChange={(e) => handleAttributeChange('visibility', e.target.value)}
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
                    >
                      Save
                    </Button>
                  </div>
                ) : (
                  <>
                    <ListItemText
                      className={classes.attributeText}
                      primary={
                        <span>
                          <span className={classes.visibilitySymbol}>
                            {attribute.visibility === 'public'
                              ? '+'
                              : attribute.visibility === 'protected'
                              ? '#'
                              : '-'}
                          </span>
                          {`${attribute.name}: ${attribute.type}`}
                        </span>
                      }
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

        <div className={classes.sectionDivider}>
          <span className={classes.sectionLabel}>Methods</span>
        </div>

        {/* Methods Section */}
        <CardContent
          className={`${classes.section} ${classes.methodsSection}`}
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
                      className={classes.methodText}
                      primary={
                        <span>
                          <span className={classes.visibilitySymbol}>
                            {method.visibility === 'public'
                              ? '+'
                              : method.visibility === 'protected'
                              ? '#'
                              : '-'}
                          </span>
                          {`${method.name}(): ${method.returnType}`}
                        </span>
                      }
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
