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

const useStyles = makeStyles({
  editor: {
    flexGrow: 1,
    width: '100%',
    overflow: 'hidden',
  },
  canvas: {
    width: '3000px',
    height: '3000px',
    position: 'relative',
    backgroundImage:
      'linear-gradient(#e0e0e0 1px, transparent 1px), linear-gradient(90deg, #e0e0e0 1px, transparent 1px)',
    backgroundSize: '20px 20px',
  },
  relationshipsLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    pointerEvents: 'none', 
    zIndex: 2, 
  },
  classesLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
});



const DiagramEditor = () => {


  const classes = useStyles();
  const dispatch = useDispatch();

  const [isDragging, setIsDragging] = useState(false);
  const [relationshipStartClassId, setRelationshipStartClassId] = useState(null);

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


  
  return (
    <div className={classes.editor} onClick={handleBackgroundClick} ref={diagramRef}>
      <TransformWrapper
        doubleClick={{ disabled: true }}
        wheel={{ disabled: isDragging }}
        pinch={{ disabled: isDragging }}
        panning={{ disabled: isDragging }}
      >
        <TransformComponent>
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
      </TransformWrapper>
    </div>
  );
};

export default DiagramEditor;
