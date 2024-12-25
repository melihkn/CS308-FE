// ARTIK KULLANMIYORUZ
import React, { useEffect, useState } from "react";
import { Drawer, List, ListItem, ListItemText, Box, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = "http://127.0.0.1:8002";

// setSelectedCategory function is defined to update the selected category state, and it is defined in appContent.js
const Sidebar = ({ isLoggedIn, userProfile, onLogout, isOpen, toggleSidebar, setSelectedCategory }) => {
    const [categories, setCategories] = useState([]);

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

    return (
        <Drawer anchor="left" open={isOpen} onClose={toggleSidebar(false)}>
            <Box sx={{ width: 250 }} role="presentation" onClick={toggleSidebar(false)}>
            <List>
            <ListItem>
                <ListItemText primary="Categories" />
            </ListItem>

            {/* Static "All Items" option */}
            <ListItem
                button
                onClick={() => {
                setSelectedCategory(null); // Reset the selected category
                toggleSidebar(false)(); // Close the sidebar
                }}
            >
                <ListItemText primary="All Items" />
            </ListItem>

            {/* Dynamic Category Items */}
            {categories.map((category) => (
                <ListItem
                button
                key={category.category_id}
                onClick={() => {
                    setSelectedCategory(category.category_id); // Update the category state
                    toggleSidebar(false)(); // Close the sidebar
                }}
                >
                <ListItemText primary={category.category_name} />
                </ListItem>
            ))}
            </List>

            </Box>
        </Drawer>
    );
};

export default Sidebar;
