export const addRelationship = (
  sourceClassId,
  targetClassId,
  type,
  sourceCardinality = '',
  targetCardinality = ''
) => {
  const id = Date.now().toString();
  return {
    type: 'ADD_RELATIONSHIP',
    payload: {
      id,
      sourceClassId,
      targetClassId,
      type,
      sourceCardinality,
      targetCardinality,
    },
  };
};

export const updateRelationshipCardinality = (
  id,
  sourceCardinality,
  targetCardinality
) => {
  return {
    type: 'UPDATE_RELATIONSHIP_CARDINALITY',
    payload: {
      id,
      sourceCardinality,
      targetCardinality,
    },
  };
};


export const deleteRelationship = (id) => {
  return {
    type: 'DELETE_RELATIONSHIP',
    payload: { id },
  };
};



