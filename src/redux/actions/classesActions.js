import { v4 as uuidv4 } from 'uuid';

export const addClass = () => {
  const id = uuidv4();
  return {
    type: 'ADD_CLASS',
    payload: {
      id,
      name: 'NewClass',
      position: { x: 100, y: 100 },
      attributes: [],
      methods: [],
    },
  };
};

export const updateClassPosition = (id, x, y) => ({
  type: 'UPDATE_CLASS_POSITION',
  payload: { id, x, y },
  meta: { sync: true }
});

export const updateClassName = (id, name) => ({
  type: 'UPDATE_CLASS_NAME',
  payload: { id, name },
  meta: { sync: true }
});

export const deleteClass = (id) => ({
  type: 'DELETE_CLASS',
  payload: { id },
  meta: { sync: true }
});

export const addAttribute = (classId, attribute) => ({
  type: 'ADD_ATTRIBUTE',
  payload: {
    classId,
    attribute: {
      id: Date.now().toString(),
      ...attribute
    }
  },
  meta: { sync: true }
});

export const updateAttribute = (classId, attributeId, updates) => ({
  type: 'UPDATE_ATTRIBUTE',
  payload: { classId, attributeId, updates },
  meta: { sync: true }
});

export const deleteAttribute = (classId, attributeId) => ({
  type: 'DELETE_ATTRIBUTE',
  payload: { classId, attributeId },
  meta: { sync: true }
});

export const addMethod = (classId) => ({
  type: 'ADD_METHOD',
  payload: {
    classId,
    method: {
      id: Date.now().toString(),
      name: 'newMethod',
      returnType: 'void',
      visibility: 'public',
      parameters: []
    }
  },
  meta: { sync: true }
});

export const updateMethod = (classId, methodId, updates) => ({
  type: 'UPDATE_METHOD',
  payload: { classId, methodId, updates },
  meta: { sync: true }
});

export const deleteMethod = (classId, methodId) => ({
  type: 'DELETE_METHOD',
  payload: { classId, methodId },
  meta: { sync: true }
});


