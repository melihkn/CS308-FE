// src/components/Sidebar.js

import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <h2>Product Manager</h2>
            <nav>
                <Link to="/dashboards/ProductManager/products">Products</Link>
                <Link to="/dashboards/ProductManager/reviews">Reviews</Link>
                <Link to="/dashboards/ProductManager/categories">Categories</Link>
            </nav>
        </div>
    );
};

export default Sidebar;
