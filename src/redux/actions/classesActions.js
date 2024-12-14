export const addClass = () => {
  const id = Date.now().toString();
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



export const updateClassPosition = (id, x, y) => {
  return {
    type: 'UPDATE_CLASS_POSITION',
    payload: { id, x, y },
  };
};

export const updateClassName = (id, name) => {
  return {
    type: 'UPDATE_CLASS_NAME',
    payload: { id, name },
  };
};

export const deleteClass = (id) => {
  return {
    type: 'DELETE_CLASS',
    payload: { id },
  };
};



// Add Attribute
export const addAttribute = (classId) => {
  return {
    type: 'ADD_ATTRIBUTE',
    payload: {
      classId,
      attribute: {
        id: Date.now().toString(),
        name: 'attributeName',
        type: 'int',
        visibility: 'public',
      },
    },
  };
};

// Update Attribute
export const updateAttribute = (classId, attributeId, updates) => {
  return {
    type: 'UPDATE_ATTRIBUTE',
    payload: {
      classId,
      attributeId,
      updates,
    },
  };
};

// Delete Attribute
export const deleteAttribute = (classId, attributeId) => {
  return {
    type: 'DELETE_ATTRIBUTE',
    payload: {
      classId,
      attributeId,
    },
  };
};



// Add Method
export const addMethod = (classId) => {
  return {
    type: 'ADD_METHOD',
    payload: {
      classId,
      method: {
        id: Date.now().toString(),
        name: 'methodName',
        returnType: 'void',
        visibility: 'public',
        parameters: [],
      },
    },
  };
};

// Update Method
export const updateMethod = (classId, methodId, updates) => {
  return {
    type: 'UPDATE_METHOD',
    payload: {
      classId,
      methodId,
      updates,
    },
  };
};

// Delete Method
export const deleteMethod = (classId, methodId) => {
  return {
    type: 'DELETE_METHOD',
    payload: {
      classId,
      methodId,
    },
  };
};


