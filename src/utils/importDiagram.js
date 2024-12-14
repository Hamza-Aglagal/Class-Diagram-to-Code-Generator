// utils/importDiagram.js

export const importDiagram = (dispatch, data) => {
    // Validate data structure
    if (data && data.classes && data.relationships) {
      // Dispatch actions to set the imported data
      dispatch({
        type: 'IMPORT_DIAGRAM',
        payload: data,
      });
    } else {
      alert('Invalid diagram data.');
    }
  };
  