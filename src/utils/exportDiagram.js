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
  // Transform the data to ensure proper structure
  const exportData = {
    classes: {
      byId: { ...classes.byId },
      allIds: [...classes.allIds]
    },
    relationships: {
      byId: { ...relationships.byId },
      allIds: [...relationships.allIds]
    }
  };

  return JSON.stringify(exportData, null, 2);
};
