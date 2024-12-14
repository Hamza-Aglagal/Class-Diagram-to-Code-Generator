import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { setSelectedElement } from '../redux/actions/uiActions';
import { updateRelationshipCardinality } from '../redux/actions/relationshipsActions';

const useStyles = makeStyles({
  relationshipLine: {
    stroke: '#000',
    strokeWidth: 2,
    cursor: 'pointer',
    fill: 'none',
    pointerEvents: 'visibleStroke',
  },
  cardinalityGroup: {
    cursor: 'pointer',
    pointerEvents: 'all',
  },
  cardinalityText: {
    fill: '#000',
    fontSize: '12px',
    fontWeight: 'bold',
    userSelect: 'none',
  },
  cardinalityCircle: {
    fill: '#fff',
    stroke: '#000',
    strokeWidth: 1,
  },
  selected: {
    stroke: '#f50057',
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
    setEditingSource(true);
  };

  const handleTargetDoubleClick = (e) => {
    e.stopPropagation();
    setEditingTarget(true);
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

  if (!sourceClass || !targetClass) return null;



  // Positions and dimensions
  const sourcePosition = sourceClass.position;
  const targetPosition = targetClass.position;

  const sourceDimensions = sourceClass.dimensions || { width: 200, height: 100 };
  const targetDimensions = targetClass.dimensions || { width: 200, height: 100 };

  const sourceCenterX = sourcePosition.x + sourceDimensions.width / 2;
  const sourceCenterY = sourcePosition.y + sourceDimensions.height / 2;
  const targetCenterX = targetPosition.x + targetDimensions.width / 2;
  const targetCenterY = targetPosition.y + targetDimensions.height / 2;




  // Function to calculate edge points
  function getEdgePoint(rectWidth, rectHeight, centerX, centerY, targetX, targetY) {
    const dx = targetX - centerX;
    const dy = targetY - centerY;

    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    let scale;
    if (absDx / (rectWidth / 2) > absDy / (rectHeight / 2)) {
      scale = (rectWidth / 2) / absDx;
    } else {
      scale = (rectHeight / 2) / absDy;
    }

    const edgeX = centerX + dx * scale;
    const edgeY = centerY + dy * scale;

    return { x: edgeX, y: edgeY };
  }

  const sourceEdge = getEdgePoint(
    sourceDimensions.width,
    sourceDimensions.height,
    sourceCenterX,
    sourceCenterY,
    targetCenterX,
    targetCenterY
  );

  const targetEdge = getEdgePoint(
    targetDimensions.width,
    targetDimensions.height,
    targetCenterX,
    targetCenterY,
    sourceCenterX,
    sourceCenterY
  );

  // Define markers for different relationship types
  const markerEnd = {
    Association: 'url(#arrow)',
    Inheritance: 'url(#triangle)',
    Aggregation: 'url(#diamond)',
    Composition: 'url(#filled-diamond)',
  };

  // Calculate positions for cardinality labels
  function calculateLabelPosition(edgePoint, classCenter, classDimensions) {
    const dx = edgePoint.x - classCenter.x;
    const dy = edgePoint.y - classCenter.y;
    const angle = Math.atan2(dy, dx);

    // Offset the label further out from the edge point
    const offset = 50; // Distance from the class edge
    const x = edgePoint.x + offset * Math.cos(angle);
    const y = edgePoint.y + offset * Math.sin(angle);

    return { x, y };
  }

  const sourceLabelPos = calculateLabelPosition(
    sourceEdge,
    { x: sourceCenterX, y: sourceCenterY },
    sourceDimensions
  );

  const targetLabelPos = calculateLabelPosition(
    targetEdge,
    { x: targetCenterX, y: targetCenterY },
    targetDimensions
  );

  return (
    <>
      {/* Relationship Line */}
      <line
        x1={sourceEdge.x}
        y1={sourceEdge.y}
        x2={targetEdge.x}
        y2={targetEdge.y}
        className={`${classes.relationshipLine} ${isSelected ? classes.selected : ''}`}
        markerEnd={markerEnd[data.type]}
        onClick={handleSelect}
      />

      {/* Source Cardinality */}
      <g
        className={classes.cardinalityGroup}
        onClick={handleSelect}
        onDoubleClick={handleSourceDoubleClick}
        transform={`translate(${sourceLabelPos.x}, ${sourceLabelPos.y})`}
      >
        {!editingSource ? (
          <>
            {/* Background Circle */}
            <circle
              cx={0}
              cy={0}
              r={12} // Radius of the circle
              className={classes.cardinalityCircle}
            />
            {/* Text Label */}
            <text
              x={0}
              y={0}
              className={classes.cardinalityText}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {data.sourceCardinality}
            </text>
          </>
        ) : (
          <foreignObject x={-12} y={-12} width={24} height={24}>
            <input
              type="text"
              value={sourceCardinality}
              onChange={(e) => setSourceCardinality(e.target.value)}
              onBlur={handleSourceBlur}
              autoFocus
              style={{
                width: '100%',
                height: '100%',
                fontSize: '12px',
                textAlign: 'center',
                border: 'none',
                padding: 0,
                margin: 0,
                background: 'transparent',
              }}
            />
          </foreignObject>
        )}
      </g>

      {/* Target Cardinality */}
      <g
        className={classes.cardinalityGroup}
        onClick={handleSelect}
        onDoubleClick={handleTargetDoubleClick}
        transform={`translate(${targetLabelPos.x}, ${targetLabelPos.y})`}
      >
        {!editingTarget ? (
          <>
            {/* Background Circle */}
            <circle
              cx={0}
              cy={0}
              r={12} // Radius of the circle
              className={classes.cardinalityCircle}
            />
            {/* Text Label */}
            <text
              x={0}
              y={0}
              className={classes.cardinalityText}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {data.targetCardinality}
            </text>
          </>
        ) : (
          <foreignObject x={-12} y={-12} width={24} height={24}>
            <input
              type="text"
              value={targetCardinality}
              onChange={(e) => setTargetCardinality(e.target.value)}
              onBlur={handleTargetBlur}
              autoFocus
              style={{
                width: '100%',
                height: '100%',
                fontSize: '12px',
                textAlign: 'center',
                border: 'none',
                padding: 0,
                margin: 0,
                background: 'transparent',
              }}
            />
          </foreignObject>
        )}
      </g>
    </>
  );
};

export default RelationshipComponent;
