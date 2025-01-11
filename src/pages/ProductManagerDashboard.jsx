import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import { CssBaseline, Box, Typography, IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SideNavbar from '../scenes/global/pmsidenavbar';
import ProductTable from './ProductTable';
import ReviewTable from './ReviewTable';
import CategoryTable from './CategoryTable';
import OrdersTable from './OrdersTable';
import Topbar from '../scenes/global/topbar';

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

const ProductManagerDashboard = ({ onLogout, userProfile }) => {

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <SideNavbar userProfile={userProfile}/>

      {/* Main Content */}
      <div
        style={{
          flexGrow: 1,
          overflow: "auto",
        }}
      >
        <CssBaseline />
        <Topbar onLogout={onLogout}/>
        <Routes>
          <Route path="products" element={<ProductTable />} />
          <Route path="reviews" element={<ReviewTable />} />
          <Route path="categories" element={<CategoryTable />} />
          <Route path="orders" element={<OrdersTable/>} />
          
        </Routes>
      </div>
    </div>
  );
}

export default ProductManagerDashboard;