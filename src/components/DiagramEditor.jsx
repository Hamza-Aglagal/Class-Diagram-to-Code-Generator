import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import ClassComponent from './ClassComponent';
import RelationshipComponent from './RelationshipComponent';
import { makeStyles } from '@material-ui/core/styles';
import {
  setSelectedElement,
  setMode,
  setRelationshipType,
  setDiagramRef,
} from '../redux/actions/uiActions';
import { addRelationship } from '../redux/actions/relationshipsActions';
import { IconButton, Typography, Tooltip } from '@material-ui/core';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import RestoreIcon from '@material-ui/icons/Restore';

const useStyles = makeStyles({
  editor: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100vh',
    overflow: 'hidden',
    backgroundColor: '#f4f4f9',
    margin: 0,
    padding: 0,
  },
  content: {
    marginLeft: '300px',
    height: '100%',
    margin: 0,
    padding: 0,
  },
  canvas: {
    width: '100%',
    height: '100%',
    position: 'relative',
    margin: 0,
    padding: 0,
    backgroundImage:
      'linear-gradient(#e0e0e0 1px, transparent 1px), linear-gradient(90deg, #e0e0e0 1px, transparent 1px)',
    backgroundSize: '20px 20px',
    transformOrigin: '0 0',
  },
  relationshipsLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    pointerEvents: 'none',
    zIndex: 2,
    width: '100%',
    height: '100%',
  },
  classesLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  zoomControls: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '8px',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    zIndex: 1000,
  },
  zoomButton: {
    backgroundColor: '#fff',
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
  },
  zoomText: {
    marginLeft: '8px',
    fontSize: '14px',
    color: '#666',
  },
});



const DiagramEditor = () => {


  const classes = useStyles();
  const dispatch = useDispatch();
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [relationshipStartClassId, setRelationshipStartClassId] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(100);

  const classIds = useSelector((state) => state.classes.allIds);
  const classesById = useSelector((state) => state.classes.byId);
  const relationships = useSelector((state) =>
    state.relationships.allIds.map((id) => state.relationships.byId[id])
  );
  const mode = useSelector((state) => state.ui.mode);
  const relationshipType = useSelector((state) => state.ui.relationshipType);

  const diagramRef = useRef(null);

  useEffect(() => {
    dispatch(setDiagramRef(diagramRef));
  }, [diagramRef, dispatch]);

  const handleBackgroundClick = () => {
    dispatch(setSelectedElement(null));
    if (mode === 'addingRelationship') {
      dispatch(setMode('default'));
      dispatch(setRelationshipType(null));
      setRelationshipStartClassId(null);
    }
  };



  const handleClassClick = (classId) => {
    if (mode === 'addingRelationship') {
      if (!relationshipStartClassId) {
        
        setRelationshipStartClassId(classId);
      } else {
        
        const sourceCardinality = prompt('Enter source cardinality:', '1');
        const targetCardinality = prompt('Enter target cardinality:', '*');
        dispatch(
          addRelationship(
            relationshipStartClassId,
            classId,
            relationshipType,
            sourceCardinality,
            targetCardinality
          )
        );
        dispatch(setMode('default'));
        dispatch(setRelationshipType(null));
        setRelationshipStartClassId(null);
      }
    } else {

      dispatch(setSelectedElement(classId));
    }
  };

  const handleZoomIn = (zoomInFunc) => {
    if (typeof zoomInFunc === 'function') {
      zoomInFunc(0.2);
    }
  };

  const handleZoomOut = (zoomOutFunc) => {
    if (typeof zoomOutFunc === 'function') {
      zoomOutFunc(0.2);
    }
  };

  const handleReset = (resetFunc) => {
    if (typeof resetFunc === 'function') {
      resetFunc();
      setScale(1);
    }
  };

  return (
    <div className={classes.editor} onClick={handleBackgroundClick} ref={diagramRef}>
      <div className={classes.content}>
        <TransformWrapper
          initialScale={1}
          minScale={0.1}
          maxScale={4}
          centerOnInit={true}
          centerZoomedOut={true}
          limitToBounds={false}
          doubleClick={{ disabled: true }}
          wheel={{ disabled: isDragging }}
          pinch={{ disabled: isDragging }}
          panning={{ disabled: isDragging }}
          onTransformed={({ state }) => {
            setZoomLevel(Math.round(state.scale * 100));
          }}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              <div className={classes.zoomControls}>
                <Tooltip title="Zoom In">
                  <IconButton 
                    className={classes.zoomButton}
                    onClick={() => zoomIn(0.2)}
                  >
                    <ZoomInIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Zoom Out">
                  <IconButton 
                    className={classes.zoomButton}
                    onClick={() => zoomOut(0.2)}
                  >
                    <ZoomOutIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Reset Zoom">
                  <IconButton 
                    className={classes.zoomButton}
                    onClick={() => {
                      resetTransform();
                      setZoomLevel(100);
                    }}
                  >
                    <RestoreIcon />
                  </IconButton>
                </Tooltip>
                <span className={classes.zoomText}>
                  {zoomLevel}%
                </span>
              </div>
              <TransformComponent
                wrapperStyle={{
                  width: '100%',
                  height: '100%',
                  overflow: 'hidden'
                }}
                contentStyle={{
                  width: '100%',
                  height: '100%'
                }}
              >
                <div className={classes.canvas}>
                  <div className={classes.classesLayer}>
                    {classIds.map((id) => (
                      <ClassComponent
                        key={id}
                        data={classesById[id]}
                        setIsDragging={setIsDragging}
                        onClick={() => handleClassClick(id)}
                      />
                    ))}
                  </div>

                  
                  <svg
                    className={classes.relationshipsLayer}
                    width="3000"
                    height="3000"
                    overflow="visible" 
                  >
                    <defs>
                      
                      <marker
                        id="arrow"
                        markerWidth="10"
                        markerHeight="7"
                        refX="9"
                        refY="3.5"
                        orient="auto"
                        markerUnits="strokeWidth"
                      >
                        <path d="M0,0 L10,3.5 L0,7 z" fill="#000" />
                      </marker>

                      
                      <marker
                        id="triangle"
                        markerWidth="12"
                        markerHeight="12"
                        refX="10"
                        refY="6"
                        orient="auto"
                        markerUnits="strokeWidth"
                      >
                        <path d="M0,0 L12,6 L0,12 z" fill="#fff" stroke="#000" />
                      </marker>

                      
                      <marker
                        id="diamond"
                        markerWidth="12"
                        markerHeight="12"
                        refX="12"
                        refY="6"
                        orient="auto"
                        markerUnits="strokeWidth"
                      >
                        <path d="M0,6 L6,0 L12,6 L6,12 z" fill="#fff" stroke="#000" />
                      </marker>

                      
                      <marker
                        id="filled-diamond"
                        markerWidth="12"
                        markerHeight="12"
                        refX="12"
                        refY="6"
                        orient="auto"
                        markerUnits="strokeWidth"
                      >
                        <path d="M0,6 L6,0 L12,6 L6,12 z" fill="#000" />
                      </marker>
                    </defs>

                    
                    {relationships.map((rel) => (
                      <RelationshipComponent key={rel.id} data={rel} />
                    ))}
                  </svg>



                </div>
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>
    </div>
  );
};

export default DiagramEditor;
