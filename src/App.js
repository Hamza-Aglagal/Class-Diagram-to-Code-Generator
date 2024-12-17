import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Pages/Home';
import Editor from './Pages/Editor';
import Auth from './Pages/Auth';
import PrivateRoute from './components/PrivateRoute';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={  <PrivateRoute> <Home /> </PrivateRoute> } />
      <Route path="/auth" element={<Auth />} />
      <Route path="/editor/:sessionId" element={ <PrivateRoute> <Editor /> </PrivateRoute>  } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Router>
);

export default App;
