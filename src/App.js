// App.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppContent from './AppContent';

import { ColorModeContext, useMode } from './theme.js';
import { ThemeProvider, CssBaseline } from '@mui/material';
// theme provider will allow us to change the theme of the application

function App() {
  const [theme, colorMode] = useMode(); // get the theme and color mode from the useMode hook

  return(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <ColorModeContext.Provider value={colorMode}>
          <AppContent />
        </ColorModeContext.Provider>
      </Router>
    </ThemeProvider>
  )
}

export default App;
