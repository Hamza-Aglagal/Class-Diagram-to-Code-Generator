const initialState = {
  byId: {},
  allIds: [],
};

export default function classesReducer(state = initialState, action) {
  switch (action.type) {
    case 'ADD_CLASS':
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.id]: action.payload,
        },
        allIds: [...state.allIds, action.payload.id],
      };
    case 'UPDATE_CLASS_POSITION':
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.id]: {
            ...state.byId[action.payload.id],
            position: { x: action.payload.x, y: action.payload.y },
          },
        },
      };
    case 'UPDATE_CLASS_NAME':
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.id]: {
            ...state.byId[action.payload.id],
            name: action.payload.name,
          },
        },
      };
    case 'DELETE_CLASS':
      const { [action.payload.id]: deletedClass, ...restClasses } = state.byId;
      return {
        ...state,
        byId: restClasses,
        allIds: state.allIds.filter((id) => id !== action.payload.id),
      };


    // Attributes
    case 'ADD_ATTRIBUTE': {
      const { classId, attribute } = action.payload;
      const updatedClass = {
        ...state.byId[classId],
        attributes: [...state.byId[classId].attributes, attribute],
      };
      return {
        ...state,
        byId: { ...state.byId, [classId]: updatedClass },
      };
    }

    case 'UPDATE_ATTRIBUTE': {
      const { classId, attributeId, updates } = action.payload;
      const updatedAttributes = state.byId[classId].attributes.map((attr) =>
        attr.id === attributeId ? { ...attr, ...updates } : attr
      );
      return {
        ...state,
        byId: {
          ...state.byId,
          [classId]: { ...state.byId[classId], attributes: updatedAttributes },
        },
      };
    }

    case 'DELETE_ATTRIBUTE': {
      const { classId, attributeId } = action.payload;
      const updatedAttributes = state.byId[classId].attributes.filter(
        (attr) => attr.id !== attributeId
      );
      return {
        ...state,
        byId: {
          ...state.byId,
          [classId]: { ...state.byId[classId], attributes: updatedAttributes },
        },
      };
    }

    // Methods
    case 'ADD_METHOD': {
      const { classId, method } = action.payload;
      const updatedClass = {
        ...state.byId[classId],
        methods: [...state.byId[classId].methods, method],
      };
      return {
        ...state,
        byId: { ...state.byId, [classId]: updatedClass },
      };
    }

    case 'UPDATE_METHOD': {
      const { classId, methodId, updates } = action.payload;
      const updatedMethods = state.byId[classId].methods.map((method) =>
        method.id === methodId ? { ...method, ...updates } : method
      );
      return {
        ...state,
        byId: {
          ...state.byId,
          [classId]: { ...state.byId[classId], methods: updatedMethods },
        },
      };
    }

    case 'DELETE_METHOD': {
      const { classId, methodId } = action.payload;
      const updatedMethods = state.byId[classId].methods.filter(
        (method) => method.id !== methodId
      );
      return {
        ...state,
        byId: {
          ...state.byId,
          [classId]: { ...state.byId[classId], methods: updatedMethods },
        },
      };
    }

    case 'IMPORT_DIAGRAM':
      return action.payload.classes;


    default:
      return state;
  }
}
