import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { setSelectedElement } from '../redux/actions/uiActions';
import { updateRelationshipCardinality } from '../redux/actions/relationshipsActions';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@material-ui/core';

const useStyles = makeStyles({
  relationshipLine: {
    stroke: '#34495e',
    strokeWidth: 2,
    fill: 'none',
  },
  associationLine: {
    strokeDasharray: '4,2',
  },
  inheritanceLine: {
    strokeDasharray: '0',
  },
  aggregationLine: {
    strokeDasharray: '8,4',
  },
  compositionLine: {
    strokeDasharray: '0',
  },
  selected: {
    stroke: '#e74c3c',
  },
  cardinalityText: {
    fill: '#000',
    fontSize: '12px',
    fontWeight: 'bold',
    userSelect: 'none',
    pointerEvents: 'none',
    textAnchor: 'middle',
    backgroundColor: 'white',
    padding: '2px',
  },
  relationshipGroup: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
});

const RelationshipComponent = ({ data }) => {
  
  const classes = useStyles();
  const dispatch = useDispatch();
  const selectedElementId = useSelector((state) => state.ui.selectedElementId);
  const isSelected = selectedElementId === data.id;

  const sourceClass = useSelector(
    (state) => state.classes.byId[data.sourceClassId]
  );
  const targetClass = useSelector(
    (state) => state.classes.byId[data.targetClassId]
  );

  const [editingSource, setEditingSource] = useState(false);
  const [editingTarget, setEditingTarget] = useState(false);
  const [sourceCardinality, setSourceCardinality] = useState(
    data.sourceCardinality
  );
  const [targetCardinality, setTargetCardinality] = useState(
    data.targetCardinality
  );

  const handleSelect = (e) => {
    e.stopPropagation();
    dispatch(setSelectedElement(data.id));
  };

  const handleSourceDoubleClick = (e) => {
    e.stopPropagation();
    if (relationHasCardinality(data.type)) {
      setEditingSource(true);
    }
  };

  const handleTargetDoubleClick = (e) => {
    e.stopPropagation();
    if (relationHasCardinality(data.type)) {
      setEditingTarget(true);
    }
  };

  const handleSourceBlur = () => {
    dispatch(
      updateRelationshipCardinality(
        data.id,
        sourceCardinality,
        data.targetCardinality
      )
    );
    setEditingSource(false);
  };

  const handleTargetBlur = () => {
    dispatch(
      updateRelationshipCardinality(
        data.id,
        data.sourceCardinality,
        targetCardinality
      )
    );
    setEditingTarget(false);
  };

  // Add state for dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!sourceClass || !targetClass) return null;

  // Helper function to check if the relationship type uses cardinality
  const relationHasCardinality = (type) => {
    const hasCardinality = ['Association', 'Aggregation', 'Composition'].includes(type);
    console.log('Relationship type:', type, 'Has cardinality:', hasCardinality);
    return hasCardinality;
  };

  // Updated helper function to get connection points on class boundaries
  function getConnectionPoint(sourceRect, targetRect) {
    const { x: x1, y: y1, width: w1, height: h1 } = sourceRect;
    const { x: x2, y: y2, width: w2, height: h2 } = targetRect;

    // Calculate centers (only used for direction vector)
    const cx1 = x1 + w1 / 2;
    const cy1 = y1 + h1 / 2;
    const cx2 = x2 + w2 / 2;
    const cy2 = y2 + h2 / 2;

    // Calculate direction vector
    const dx = cx2 - cx1;
    const dy = cy2 - cy1;

    function findBestEdgePoint(rect, isSource) {
      const { x, y, width, height } = rect;
      const centerX = x + width / 2;
      const centerY = y + height / 2;

      // Calculate distances to each edge
      const points = [
        { x: x, y: centerY, edge: 'left' },           // Left edge
        { x: x + width, y: centerY, edge: 'right' },  // Right edge
        { x: centerX, y: y, edge: 'top' },            // Top edge
        { x: centerX, y: y + height, edge: 'bottom' } // Bottom edge
      ];

      // For source point, we want the edge facing the target
      // For target point, we want the edge facing the source
      const dirX = isSource ? dx : -dx;
      const dirY = isSource ? dy : -dy;

      // Calculate scores for each edge based on direction vector
      const scores = points.map(point => {
        const edgeX = point.x - centerX;
        const edgeY = point.y - centerY;
        // Dot product to determine alignment with direction
        return {
          point,
          score: (edgeX * dirX + edgeY * dirY) /
            Math.sqrt((edgeX * edgeX + edgeY * edgeY) * (dirX * dirX + dirY * dirY))
        };
      });

      // Sort by score and get the best point
      const bestPoint = scores.sort((a, b) => b.score - a.score)[0].point;

      // Adjust the point to be exactly on the edge
      switch (bestPoint.edge) {
        case 'left':
          return { x: x, y: Math.min(Math.max(y, cy2), y + height) };
        case 'right':
          return { x: x + width, y: Math.min(Math.max(y, cy2), y + height) };
        case 'top':
          return { x: Math.min(Math.max(x, cx2), x + width), y: y };
        case 'bottom':
          return { x: Math.min(Math.max(x, cx2), x + width), y: y + height };
        default:
          return bestPoint;
      }
    }

    const sourcePoint = findBestEdgePoint(sourceRect, true);
    const targetPoint = findBestEdgePoint(targetRect, false);

    return {
      x1: sourcePoint.x,
      y1: sourcePoint.y,
      x2: targetPoint.x,
      y2: targetPoint.y,
    };
  }

  // Calculate actual class dimensions based on content
  const calculateClassDimensions = (classData) => {
    const headerHeight = 40;  // Height of class name header
    const attributeHeight = 30; // Fixed height per attribute
    const methodHeight = 30;    // Fixed height per method
    const padding = 10;         // Padding inside class

    // Count number of attributes and methods
    const attributeCount = classData.attributes?.length || 0;
    const methodCount = classData.methods?.length || 0;

    // Calculate minimum height when no attributes or methods exist
    const minHeight = headerHeight + (padding * 2);

    // Calculate total height including attributes and methods if they exist
    const totalHeight = Math.max(
      minHeight,
      (methodCount + attributeCount > 7) ? 300 : 
      headerHeight + 
      (attributeCount > 0 ? attributeHeight * attributeCount : 0) +
      (methodCount > 0 ? methodHeight * methodCount : 0) +
      (padding * 2) + 35
    );

    // Calculate width based on content (you may want to adjust this)
    const width = 221;  // Fixed width for now

    return {
      width,
      height: totalHeight,
    };
  };

  // Updated rendering logic with dynamic dimensions
  const sourceRect = {
    x: sourceClass.position.x,
    y: sourceClass.position.y,
    ...calculateClassDimensions(sourceClass),
  };

  const targetRect = {
    x: targetClass.position.x,
    y: targetClass.position.y,
    ...calculateClassDimensions(targetClass),
  };

  // Get the best connection points using the dynamic dimensions
  const { x1, y1, x2, y2 } = getConnectionPoint(sourceRect, targetRect);

  // Define markers for different relationship types
  const markerEnd = {
    Association: '', // Plain line
    Inheritance: 'url(#triangle)', // Hollow triangle
    Aggregation: 'url(#diamond)', // Empty diamond
    Composition: 'url(#filled-diamond)', // Filled diamond
  };

  // Function to get line style based on relationship type
  const getLineClass = (type) => {
    switch (type) {
      case 'Association':
        return classes.associationLine;
      case 'Inheritance':
        return classes.inheritanceLine;
      case 'Aggregation':
        return classes.aggregationLine;
      case 'Composition':
        return classes.compositionLine;
      default:
        return '';
    }
  };

  // Add this helper function to calculate text position
  const getCardinalityPosition = (x1, y1, x2, y2, isSource) => {
    const distance = 20;
    const ratio = isSource ? 0.2 : 0.8;
    
    // Calculate position along the line
    const x = x1 + (x2 - x1) * ratio;
    const y = y1 + (y2 - y1) * ratio;
    
    return { x, y };
  };

  const handleDoubleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  const handleSave = () => {
    dispatch(updateRelationshipCardinality(data.id, sourceCardinality, targetCardinality));
    setIsDialogOpen(false);
  };

  return (
    <>
      <g 
        className={classes.relationshipGroup}
        onDoubleClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDialogOpen(true);
          console.log('Double click detected'); // Debug log
        }}
      >
        {/* Add a transparent background to make clicking easier */}
        <path
          d={`M ${x1} ${y1} L ${x2} ${y2}`}
          stroke="transparent"
          strokeWidth="20"
          fill="none"
          style={{ cursor: 'pointer' }}
        />

        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          className={`${classes.relationshipLine} ${getLineClass(data.type)} ${
            isSelected ? classes.selected : ''
          }`}
          markerEnd={markerEnd[data.type]}
          onClick={handleSelect}
          pointerEvents="none"
        />

        {/* Source Cardinality */}
        <text
          x={x1 + (x2 - x1) * 0.2}
          y={y1 + (y2 - y1) * 0.2 - 10}
          textAnchor="middle"
          style={{
            fill: 'black',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
          pointerEvents="none"
        >
          {data.sourceCardinality || '1'}
        </text>

        {/* Target Cardinality */}
        <text
          x={x1 + (x2 - x1) * 0.8}
          y={y1 + (y2 - y1) * 0.8 - 10}
          textAnchor="middle"
          style={{
            fill: 'black',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
          pointerEvents="none"
        >
          {data.targetCardinality || '*'}
        </text>
      </g>

      <Dialog 
        open={isDialogOpen} 
        onClose={handleClose}
        onClick={(e) => e.stopPropagation()}
      >
        <DialogTitle>Edit Relationship Cardinality</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Source Cardinality"
            value={sourceCardinality}
            onChange={(e) => setSourceCardinality(e.target.value)}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Target Cardinality"
            value={targetCardinality}
            onChange={(e) => setTargetCardinality(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RelationshipComponent;
