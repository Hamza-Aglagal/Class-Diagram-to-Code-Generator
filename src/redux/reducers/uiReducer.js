
const initialState = {
  mode: 'default',
  selectedElementId: null,
  relationshipType: null,
  diagramRef: null,
};

export default function uiReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_MODE':
      return {
        ...state,
        mode: action.payload.mode,
      };
    case 'SET_SELECTED_ELEMENT':
      return {
        ...state,
        selectedElementId: action.payload.id,
      };
    case 'SET_RELATIONSHIP_TYPE':
      return {
        ...state,
        relationshipType: action.payload.relationshipType,
      };
    case 'SET_DIAGRAM_REF':
      return {
        ...state,
        diagramRef: action.payload.diagramRef,
      };

    default:
      return state;
  }
}
