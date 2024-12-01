// ProductManagerDashboard.js

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SideNavbar from './sidenavbar';
import Sidebar from './Sidebar';
import ProductTable from './ProductTable';
import ReviewTable from './ReviewTable';
import CategoryTable from './CategoryTable';
import './Dashboard.css';
import { Box } from '@mui/material';

const ProductManagerDashboard = () => {
  return (
    <Box
    sx={{
      display: 'flex',
      height: '100vh', // Ensures the dashboard fills the viewport height
      overflow: 'hidden', // Prevents scrollbars caused by unnecessary spacing
    }}
  >
    {/* Sidebar */}
    <SideNavbar role={localStorage.getItem("token").role}/>

    {/* Main Content */}
    <Box
      sx={{
        flexGrow: 1, // Makes the main content take the remaining space
        padding: '20px', // Adds padding to the main content
        margin: 0, // Removes any unnecessary margin
        overflowY: 'auto', // Enables vertical scrolling if content overflows
      }}
    >
      <Routes>
        <Route path="products" element={<ProductTable />} />
        <Route path="reviews" element={<ReviewTable />} />
        <Route path="categories" element={<CategoryTable />} />
      </Routes>
    </Box>
  </Box>
  );
};

export default ProductManagerDashboard;

/**/ 