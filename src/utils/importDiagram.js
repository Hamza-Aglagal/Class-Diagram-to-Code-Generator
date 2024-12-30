// utils/importDiagram.js

let fileInput = null;

const createFileInput = (callback) => {
  if (fileInput) {
    document.body.removeChild(fileInput);
  }

  fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.json';
  fileInput.style.display = 'none';
  
  fileInput.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      const data = await importDiagram(file);
      callback(data);
    } catch (error) {
      console.error('Import failed:', error);
      alert(error.message);
    }
    
    fileInput.value = '';
  };

  document.body.appendChild(fileInput);
  return fileInput;
};

export const importDiagram = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        
        // Ensure the data structure matches exactly what we exported
        if (!data.classes?.byId || !data.classes?.allIds || 
            !data.relationships?.byId || !data.relationships?.allIds) {
          throw new Error('Invalid diagram format');
        }

        // Return the data in the exact same structure as it was exported
        resolve({
          classes: {
            byId: { ...data.classes.byId },
            allIds: [...data.classes.allIds]
          },
          relationships: {
            byId: { ...data.relationships.byId },
            allIds: [...data.relationships.allIds]
          }
        });
      } catch (error) {
        reject(new Error('Failed to parse diagram file: ' + error.message));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
};

export const triggerFileInput = (callback) => {
  const input = createFileInput(callback);
  input.click();
};
  