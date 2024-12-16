import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Editor from './Pages/Editor';
import Auth from './Pages/Auth';
import PrivateRoute from './components/PrivateRoute';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route
        path="/editor"
        element={
          <PrivateRoute>
            <Editor />
          </PrivateRoute>
        }
      />
    </Routes>
  </Router>
);

export default App;
