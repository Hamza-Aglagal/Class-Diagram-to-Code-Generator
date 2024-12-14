const initialState = {
  byId: {},
  allIds: [],
};

export default function relationshipsReducer(state = initialState, action) {
  switch (action.type) {

    case 'ADD_RELATIONSHIP':
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.id]: action.payload,
        },
        allIds: [...state.allIds, action.payload.id],
      };

    case 'UPDATE_RELATIONSHIP_CARDINALITY':
      const { id, sourceCardinality, targetCardinality } = action.payload;
      return {
        ...state,
        byId: {
          ...state.byId,
          [id]: {
            ...state.byId[id],
            sourceCardinality,
            targetCardinality,
          },
        },
      };

    case 'DELETE_RELATIONSHIP':
      const { [action.payload.id]: deletedRel, ...restRels } = state.byId;
      return {
        ...state,
        byId: restRels,
        allIds: state.allIds.filter((id) => id !== action.payload.id),
      };

    case 'IMPORT_DIAGRAM':
      return action.payload.relationships;



    default:
      return state;
  }
}
