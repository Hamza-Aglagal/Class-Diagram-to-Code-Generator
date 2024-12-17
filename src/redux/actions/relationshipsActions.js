export const addRelationship = (
  sourceClassId,
  targetClassId,
  type
) => ({
  type: 'ADD_RELATIONSHIP',
  payload: {
    id: Date.now().toString(),
    sourceClassId,
    targetClassId,
    type,
    sourceCardinality: '',
    targetCardinality: ''
  },
  meta: { sync: true }
});

export const updateRelationshipCardinality = (
  id,
  sourceCardinality,
  targetCardinality
) => ({
  type: 'UPDATE_RELATIONSHIP_CARDINALITY',
  payload: {
    id,
    sourceCardinality,
    targetCardinality
  },
  meta: { sync: true }
});

export const deleteRelationship = (id) => ({
  type: 'DELETE_RELATIONSHIP',
  payload: { id },
  meta: { sync: true }
});



