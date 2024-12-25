import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import { CssBaseline, Box, Typography, IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SideNavbar from './sidenavbar';
import ProductTable from './ProductTable';
import ReviewTable from './ReviewTable';
import CategoryTable from './CategoryTable';
import OrdersTable from './OrdersTable';

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

function ColorModeToggle() {
  const { toggleColorMode } = React.useContext(ColorModeContext);
  const theme = useTheme();

  return (
    <IconButton onClick={toggleColorMode} color="inherit" size="small">
      {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
}

const ProductManagerDashboard = () => {
  const [mode, setMode] = React.useState('light');
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          <SideNavbar role={localStorage.getItem("token").role} />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: { xs: 2, md: 3 },
              overflow: 'auto',
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              mb: 3,
              mt: 2
            }}>
              <Typography variant="h5" component="h1" sx={{ fontWeight: 'medium' }}>
                Product Manager Dashboard
              </Typography>
              <ColorModeToggle />
            </Box>
            <Routes>
              <Route path="products" element={<ProductTable />} />
              <Route path="reviews" element={<ReviewTable />} />
              <Route path="categories" element={<CategoryTable />} />
              <Route path="orders" element={<OrdersTable/>} />
            </Routes>
          </Box>
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default ProductManagerDashboard;