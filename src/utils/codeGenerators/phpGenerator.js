// src/utils/codeGenerators/phpGenerator.js

export function generatePHPCode(diagramData) {
  const { classes, relationships } = diagramData;
  const classDefinitions = [];
  const classNames = getClassNames(classes);

  // Map relationships for associations
  const associations = getAssociations(relationships, classNames);

  for (const classId of classes.allIds) {
    const classData = classes.byId[classId];
    const baseClass = getBaseClass(classId, relationships, classNames);
    const attributes = classData.attributes || [];
    const methods = classData.methods || [];

    let classDef = `<?php\n\nclass ${classData.name} ${baseClass} {\n`;

    // Auto-increment ID
    classDef += `    private static $idCounter = 1;\n`;
    classDef += `    private $id;\n`;

    // Attributes
    for (const attr of attributes) {
      const accessModifier = attr.access || 'private';
      classDef += `    ${accessModifier} $${attr.name};\n`;
    }

    // Associations
    const classAssociations = associations[classId] || [];
    for (const assoc of classAssociations) {
      const targetClassName = classNames[assoc.targetClassId];
      classDef += `    private $${assoc.name}; // Association to ${targetClassName}\n`;
    }

    // Constructor
    classDef += `\n    public function __construct(`;
    // Constructor parameters
    const constructorParams = attributes.map((attr) => `$${attr.name}`);
    classDef += constructorParams.join(', ');
    classDef += `) {\n`;
    // Auto-increment ID assignment
    classDef += `        $this->id = self::$idCounter++;\n`;
    // Initialize attributes
    for (const attr of attributes) {
      classDef += `        $this->${attr.name} = $${attr.name};\n`;
    }
    // Initialize associations to null
    for (const assoc of classAssociations) {
      classDef += `        $this->${assoc.name} = null; // Association to ${classNames[assoc.targetClassId]}\n`;
    }
    classDef += `    }\n`;

    // Methods
    for (const method of methods) {
      const methodSignature = getPHPMethodSignature(method);
      classDef += `\n    ${methodSignature} {\n        // TODO: Implement\n    }\n`;
    }

    classDef += `}\n\n?>`;
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

function getBaseClass(classId, relationships, classNames) {
  const inheritance = relationships.allIds
    .map((relId) => relationships.byId[relId])
    .find(
      (rel) =>
        rel.type === 'Inheritance' && rel.sourceClassId === classId
    );
  if (inheritance) {
    return `extends ${classNames[inheritance.targetClassId]}`;
  } else {
    return '';
  }
}

function getPHPMethodSignature(method) {
  const accessModifier = method.access || 'public';
  const params = method.parameters || [];
  const paramList = params.map((param) => `$${param.name}`).join(', ');
  return `${accessModifier} function ${method.name}(${paramList})`;
}

function getAssociations(relationships, classNames) {
  const associations = {};
  relationships.allIds
    .map((relId) => relationships.byId[relId])
    .filter((rel) => rel.type === 'Association' || rel.type === 'Aggregation' || rel.type === 'Composition')
    .forEach((rel) => {
      if (!associations[rel.sourceClassId]) {
        associations[rel.sourceClassId] = [];
      }
      const name = rel.name || classNames[rel.targetClassId].toLowerCase();
      associations[rel.sourceClassId].push({
        targetClassId: rel.targetClassId,
        name,
      });
    });
  return associations;
}
