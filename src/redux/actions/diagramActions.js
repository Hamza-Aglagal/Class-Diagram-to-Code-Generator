import { exportDiagram, exportDiagramAsImage } from '../../utils/exportDiagram';
import { triggerFileInput } from '../../utils/importDiagram';

export const exportDiagramAction = (classes, relationships) => {
  try {
    const jsonStr = exportDiagram(classes, relationships);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diagram.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Export failed:', error);
    alert('Failed to export diagram: ' + error.message);
  }
};

export const importDiagramAction = () => {
  return (dispatch) => {
    console.log('Starting import...');
    triggerFileInput((data) => {
      console.log('File selected, data:', data);
      dispatch({ type: 'CLEAR_DIAGRAM' });
      console.log('Diagram cleared');
      dispatch({
        type: 'IMPORT_DIAGRAM',
        payload: data
      });
      console.log('Import dispatched');
    });
  };
};

export const exportDiagramAsImageAction = (diagramNode) => {
  return async () => {
    try {
      const blob = await exportDiagramAsImage(diagramNode);
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'diagram.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export as image failed:', error);
      alert('Failed to export diagram as image: ' + error.message);
    }
  };
};