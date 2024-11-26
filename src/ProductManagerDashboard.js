// ProductManagerDashboard.js

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Sidebar from './Sidebar';
import ProductTable from './ProductTable';
import ReviewTable from './ReviewTable';
import CategoryTable from './CategoryTable';
import './Dashboard.css';

const ProductManagerDashboard = () => {
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-content">
        <Routes>
          <Route path="products" element={<ProductTable />} />
          <Route path="reviews" element={<ReviewTable />} />
          <Route path="categories" element={<CategoryTable />} />
          
        </Routes>
      </div>
    </div>
  );
};

export default ProductManagerDashboard;

/**/ 