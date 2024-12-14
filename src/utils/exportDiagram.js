
import domtoimage from 'dom-to-image';



  
export const exportDiagramAsImage = (diagramNode) => {
  if (!diagramNode) return Promise.reject('Diagram node is null');

  const options = {
    bgcolor: '#ffffff',
    width: diagramNode.scrollWidth,
    height: diagramNode.scrollHeight,
    style: {
      transform: 'scale(1)',
      transformOrigin: 'top left',
    },
  };

  return domtoimage.toBlob(diagramNode, options);
};






export const exportDiagram = (classes, relationships) => {
  const data = {
    classes,
    relationships,
  };

  const json = JSON.stringify(data, null, 2); // Pretty-print JSON

  return json;
};
