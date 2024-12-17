import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { setSelectedElement } from '../redux/actions/uiActions';
import { updateRelationshipCardinality } from '../redux/actions/relationshipsActions';

const useStyles = makeStyles({
  relationshipLine: {
    stroke: '#34495e',
    strokeWidth: 2,
    cursor: 'pointer',
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

  if (!sourceClass || !targetClass) return null;

  // Helper function to check if the relationship type uses cardinality
  const relationHasCardinality = (type) => {
    return ['Association', 'Aggregation', 'Composition'].includes(type);
  };

  // Updated helper function to get connection points on class boundaries
  function getConnectionPoint(sourceRect, targetRect) {
    const { x: x1, y: y1, width: w1, height: h1 } = sourceRect;
    const { x: x2, y: y2, width: w2, height: h2 } = targetRect;

    // Centers of source and target
    const cx1 = x1 + w1 / 2;
    const cy1 = y1 + h1 / 2;
    const cx2 = x2 + w2 / 2;
    const cy2 = y2 + h2 / 2;

    // Direction from source to target
    const dx = cx2 - cx1;
    const dy = cy2 - cy1;

    // Function to calculate intersection with rectangle edges
    function getEdgeIntersection(rect, dx, dy) {
      const { x, y, width, height } = rect;
      const edges = [];

      // Compute parameters for equations
      const m = dy / dx;

      // Avoid division by zero
      if (dx === 0) {
        // Vertical line
        return {
          x: cx1,
          y: dy > 0 ? y + height : y,
        };
      }

      // Left edge
      let yAtLeft = m * (x - cx1) + cy1;
      if (yAtLeft >= y && yAtLeft <= y + height) {
        edges.push({ x: x, y: yAtLeft });
      }

      // Right edge
      let yAtRight = m * (x + width - cx1) + cy1;
      if (yAtRight >= y && yAtRight <= y + height) {
        edges.push({ x: x + width, y: yAtRight });
      }

      // Top edge
      let xAtTop = (y - cy1) / m + cx1;
      if (xAtTop >= x && xAtTop <= x + width) {
        edges.push({ x: xAtTop, y: y });
      }

      // Bottom edge
      let xAtBottom = (y + height - cy1) / m + cx1;
      if (xAtBottom >= x && xAtBottom <= x + width) {
        edges.push({ x: xAtBottom, y: y + height });
      }

      // Choose the intersection point that is furthest along the direction vector
      let maxProjection = -Infinity;
      let intersectionPoint = null;
      edges.forEach((point) => {
        const projection = (point.x - cx1) * dx + (point.y - cy1) * dy;
        if (projection > maxProjection) {
          maxProjection = projection;
          intersectionPoint = point;
        }
      });

      return intersectionPoint || { x: cx1, y: cy1 };
    }

    // Get intersection points on the borders
    const sourcePoint = getEdgeIntersection(sourceRect, dx, dy);
    const targetPoint = getEdgeIntersection(targetRect, -dx, -dy);

    return {
      x1: sourcePoint.x,
      y1: sourcePoint.y,
      x2: targetPoint.x,
      y2: targetPoint.y,
    };
  }

  // Updated rendering logic
  const sourceRect = {
    x: sourceClass.position.x,
    y: sourceClass.position.y,
    width: sourceClass.dimensions?.width || 200,
    height: sourceClass.dimensions?.height || 100,
  };
  const targetRect = {
    x: targetClass.position.x,
    y: targetClass.position.y,
    width: targetClass.dimensions?.width || 200,
    height: targetClass.dimensions?.height || 100,
  };

  // Get the best connection points
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

  return (
    <>
      {/* Relationship Line */}
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
      />

      {/* Display cardinalities only if the relationship type uses them */}
      {relationHasCardinality(data.type) && (
        <>
          {/* Source Cardinality */}
          <g
            onClick={handleSelect}
            onDoubleClick={handleSourceDoubleClick}
            transform={`translate(${x1}, ${y1})`}
          >
            {!editingSource ? (
              <text
                x={0}
                y={0}
                dx={-10}
                dy={-5}
                className={classes.cardinalityText}
                textAnchor="end"
                dominantBaseline="middle"
              >
                {data.sourceCardinality}
              </text>
            ) : (
              <foreignObject x={-30} y={-15} width={50} height={30}>
                <input
                  type="text"
                  value={sourceCardinality}
                  onChange={(e) => setSourceCardinality(e.target.value)}
                  onBlur={handleSourceBlur}
                  autoFocus
                  style={{
                    width: '100%',
                    fontSize: '12px',
                    textAlign: 'right',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '2px',
                  }}
                />
              </foreignObject>
            )}
          </g>

          {/* Target Cardinality */}
          <g
            onClick={handleSelect}
            onDoubleClick={handleTargetDoubleClick}
            transform={`translate(${x2}, ${y2})`}
          >
            {!editingTarget ? (
              <text
                x={0}
                y={0}
                dx={10}
                dy={-5}
                className={classes.cardinalityText}
                textAnchor="start"
                dominantBaseline="middle"
              >
                {data.targetCardinality}
              </text>
            ) : (
              <foreignObject x={-20} y={-15} width={50} height={30}>
                <input
                  type="text"
                  value={targetCardinality}
                  onChange={(e) => setTargetCardinality(e.target.value)}
                  onBlur={handleTargetBlur}
                  autoFocus
                  style={{
                    width: '100%',
                    fontSize: '12px',
                    textAlign: 'left',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '2px',
                  }}
                />
              </foreignObject>
            )}
          </g>
        </>
      )}
    </>
  );
};

export default RelationshipComponent;
