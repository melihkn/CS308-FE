// App.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppContent from './AppContent';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

// to run: npm start
// if it does not run, try before: export NODE_OPTIONS=--openssl-legacy-provider
