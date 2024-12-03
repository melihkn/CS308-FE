import React, { useEffect, useState } from "react";
import axios from "axios";
import { ProSidebar, Menu, MenuItem, SidebarHeader, SidebarFooter } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { FaBars, FaTimes } from "react-icons/fa";

const BACKEND_URL = "http://127.0.0.1:8002";

const CategorySidebar = ({ setSelectedCategory }) => {
  const [categories, setCategories] = useState([]);
  const [collapsed, setCollapsed] = useState(false); // State to handle collapsibility

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/products/get/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const toggleSidebar = () => {
    setCollapsed(!collapsed); // Toggle collapsed state
  };

  return (
    <ProSidebar
      collapsed={collapsed} // Pass the collapsed state to ProSidebar
      style={{
        position: "fixed", // Fix to the screen
        top: '64px',            // Stick to the top
        left: 0,           // Stick to the left
        height: "100vh",   // Full height
        zIndex: 1000,      // High z-index to prevent overlap issues
        backgroundColor: "#ff6600 !important", // Turuncu arka plan rengi
        color: "#ff6600",          // Yazı rengini beyaz yap
      }}
    >
      <SidebarHeader>
        <Menu iconShape="circle">
          <MenuItem icon={collapsed ? <FaBars /> : <FaTimes />} onClick={toggleSidebar}>
            {collapsed ? "Expand" : "Collapse"}
          </MenuItem>
        </Menu>
      </SidebarHeader>
      <Menu>
        {/* Menu item for All Products */}
        <MenuItem onClick={() => setSelectedCategory(null)}>All Products</MenuItem>
        {/* Dynamic menu items for categories */}
        {categories.map((category) => (
          <MenuItem
            key={category.category_id} // Use category_id as key
            onClick={() => setSelectedCategory(category.category_id)} // Send category_id to setSelectedCategory
          >
            {category.category_name}
          </MenuItem>
        ))}
      </Menu>
      <SidebarFooter>
        <Menu iconShape="circle">
          <MenuItem onClick={toggleSidebar}>
            {collapsed ? <FaBars /> : <FaTimes />}
          </MenuItem>
        </Menu>
      </SidebarFooter>
    </ProSidebar>
  );
};

export default CategorySidebar;
