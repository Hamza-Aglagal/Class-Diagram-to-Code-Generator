export const setMode = (mode) => {
  return {
    type: 'SET_MODE',
    payload: { mode },
  };
};

export const setRelationshipType = (relationshipType) => {
  return {
    type: 'SET_RELATIONSHIP_TYPE',
    payload: { relationshipType },
  };
};

export const setSelectedElement = (id) => {
  return {
    type: 'SET_SELECTED_ELEMENT',
    payload: { id },
  };
};

export const deleteSelectedElement = () => (dispatch, getState) => {
  const state = getState();
  const selectedId = state.ui.selectedElementId;

  if (state.classes.byId[selectedId]) {
    dispatch({ type: 'DELETE_CLASS', payload: { id: selectedId } });
  } else if (state.relationships.byId[selectedId]) {
    dispatch({ type: 'DELETE_RELATIONSHIP', payload: { id: selectedId } });
  }

  dispatch(setSelectedElement(null));
};


export const setDiagramRef = (diagramRef) => {
  return {
    type: 'SET_DIAGRAM_REF',
    payload: { diagramRef },
  };
};
