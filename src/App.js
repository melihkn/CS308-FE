// App.js
import React from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import AppContent from './AppContent';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
