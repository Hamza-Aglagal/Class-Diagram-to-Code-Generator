// src/utils/codeGenerators/pythonGenerator.js

export function generatePythonCode(diagramData) {
  const { classes, relationships } = diagramData;
  const classDefinitions = [];
  const classNames = getClassNames(classes);

  // Map relationships for associations
  const associations = getAssociations(relationships);

  for (const classId of classes.allIds) {
    const classData = classes.byId[classId];
    const baseClasses = getBaseClasses(classId, relationships, classNames);
    const attributes = classData.attributes || [];
    const methods = classData.methods || [];

    let classDef = `class ${classData.name}${baseClasses}:\n`;

    // Auto-increment ID
    classDef += `    _id_counter = 1\n\n`;

    // Constructor
    classDef += `    def __init__(self`;
    // Include parameters for attributes
    const constructorParams = attributes.map((attr) => attr.name);
    if (constructorParams.length > 0) {
      classDef += `, ${constructorParams.join(', ')}`;
    }
    classDef += `):\n`;

    // Auto-increment ID assignment
    classDef += `        self.id = ${classData.name}._id_counter\n`;
    classDef += `        ${classData.name}._id_counter += 1\n`;

    // Initialize attributes
    for (const attr of attributes) {
      const attrName = getPythonAttributeName(attr);
      classDef += `        self.${attrName} = ${attr.name}\n`;
    }

    // Initialize associations
    const classAssociations = associations[classId] || [];
    for (const assoc of classAssociations) {
      const targetClassName = classNames[assoc.targetClassId];
      classDef += `        self.${assoc.name} = None  # Association to ${targetClassName}\n`;
    }

    // Methods
    for (const method of methods) {
      const methodSignature = getPythonMethodSignature(method);
      classDef += `\n    ${methodSignature}\n        pass\n`;
    }

    classDefinitions.push(classDef);
  }

  return classDefinitions.join('\n\n');
}

// Helper Functions

function getClassNames(classes) {
  const classNames = {};
  for (const classId of classes.allIds) {
    classNames[classId] = classes.byId[classId].name;
  }
  return classNames;
}

function getBaseClasses(classId, relationships, classNames) {
  const inheritances = relationships.allIds
    .map((relId) => relationships.byId[relId])
    .filter(
      (rel) =>
        rel.type === 'Inheritance' && rel.sourceClassId === classId
    );
  if (inheritances.length > 0) {
    const baseClassNames = inheritances.map(
      (rel) => classNames[rel.targetClassId]
    );
    return `(${baseClassNames.join(', ')})`;
  } else {
    return '';
  }
}

function getPythonAttributeName(attr) {
  switch (attr.access) {
    case 'private':
      return `__${attr.name}`;
    case 'protected':
      return `_${attr.name}`;
    default:
      return attr.name;
  }
}

function getPythonMethodSignature(method) {
  const methodName = method.name;
  const params = method.parameters || [];
  const paramNames = params.map((param) => param.name);
  return `def ${methodName}(self${paramNames.length > 0 ? ', ' + paramNames.join(', ') : ''}):`;
}

function getAssociations(relationships) {
  const associations = {};
  relationships.allIds
    .map((relId) => relationships.byId[relId])
    .filter((rel) => rel.type === 'Association' || rel.type === 'Aggregation' || rel.type === 'Composition')
    .forEach((rel) => {
      if (!associations[rel.sourceClassId]) {
        associations[rel.sourceClassId] = [];
      }
      associations[rel.sourceClassId].push({
        targetClassId: rel.targetClassId,
        name: rel.name || `assoc_${rel.targetClassId}`,
      });
    });
  return associations;
}
