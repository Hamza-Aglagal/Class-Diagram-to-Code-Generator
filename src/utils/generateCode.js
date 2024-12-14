import { generatePythonCode } from './codeGenerators/pythonGenerator';
import { generateJavaCode } from './codeGenerators/javaGenerator';
import { generatePHPCode } from './codeGenerators/phpGenerator';

export const generateCode = (diagramData, language) => {
  switch (language) {
    case 'Python':
      return generatePythonCode(diagramData);
    case 'Java':
      return generateJavaCode(diagramData);
    case 'PHP':
      return generatePHPCode(diagramData);
    default:
      throw new Error(`Unsupported language: ${language}`);
  }
};
