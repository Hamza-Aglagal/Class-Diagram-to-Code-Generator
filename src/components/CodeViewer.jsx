import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { generateCode } from '../utils/generateCode';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import java from 'react-syntax-highlighter/dist/esm/languages/hljs/java';
import php from 'react-syntax-highlighter/dist/esm/languages/hljs/php';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { makeStyles } from '@material-ui/core/styles';



SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('php', php);


const useStyles = makeStyles({
  codeViewer: {
    position: 'fixed',
    bottom: 0,
    right: 0,
    width: '400px',
    height: '200px',
    backgroundColor: '#000000',
    color: '#00FF00',
    overflow: 'auto',
    zIndex: 1000,
    border: '1px solid #333',
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
  },
  fullScreen: {
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  languageSelector: {
    padding: '5px',
    backgroundColor: '#222',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  select: {
    backgroundColor: '#000',
    color: '#0f0',
    border: '1px solid #333',
    outline: 'none',
  },
});

const CodeViewer = () => {


  const classes = useStyles();
  const [code, setCode] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [language, setLanguage] = useState('Python');

  const classesState = useSelector((state) => state.classes);
  const relationshipsState = useSelector((state) => state.relationships);

  useEffect(() => {

    const diagramData = { classes: classesState, relationships: relationshipsState };
    const generatedCode = generateCode(diagramData, language);
    setCode(generatedCode);

  }, [classesState, relationshipsState, language]);

  const handleDoubleClick = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const getLanguageSyntax = () => {
    switch (language) {
      case 'Python':
        return 'python';
      case 'Java':
        return 'java';
      case 'PHP':
        return 'php';
      default:
        return 'plaintext';
    }
  };

  return (
    <div
      className={`${classes.codeViewer} ${isFullScreen ? classes.fullScreen : ''}`}
      onDoubleClick={handleDoubleClick}
    >

      <div className={classes.languageSelector}>
        <select
          value={language}
          onChange={handleLanguageChange}
          className={classes.select}
        >
          <option value="Python">Python</option>
          <option value="Java">Java</option>
          <option value="PHP">PHP</option>
        </select>
      </div>
      <SyntaxHighlighter
        language={getLanguageSyntax()}
        style={atomOneDark}
        customStyle={{ backgroundColor: '#000', color: '#0f0', margin: 0, padding: '10px' }}
        wrapLines={true}
        lineProps={{ style: { whiteSpace: 'pre-wrap' } }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeViewer;
