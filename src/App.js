// App.js
import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter as Router } from 'react-router-dom';
import AppContent from './AppContent';
import theme from './theme/theme'; // Import the custom theme

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Resets default browser styles */}
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
