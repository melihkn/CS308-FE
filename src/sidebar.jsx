import React, { useEffect, useState } from "react";
import { Drawer, List, ListItem, ListItemText, Box, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = "http://127.0.0.1:8002";

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
                    {/* Static Items */}
                    <ListItem button component={Link} to="/">
                        <ListItemText primary="Home" />
                    </ListItem>
                    <ListItem button component={Link} to="/products">
                        <ListItemText primary="Products" />
                    </ListItem>
                    <ListItem button component={Link} to="/cart">
                        <ListItemText primary="Cart" />
                    </ListItem>
                    {isLoggedIn ? (
                        <>
                            <ListItem button component={Link} to="/profile">
                                <ListItemText primary="Profile" />
                            </ListItem>
                            <ListItem button onClick={onLogout}>
                                <ListItemText primary="Logout" />
                            </ListItem>
                        </>
                    ) : (
                        <ListItem button component={Link} to="/login">
                            <ListItemText primary="Login" />
                        </ListItem>
                    )}
                </List>

                <Divider />

                {/* Dynamic Category Items */}
                <List>
                    <ListItem>
                        <ListItemText primary="Categories" />
                    </ListItem>
                    {categories.map((category) => (
                        <ListItem
                            button
                            key={category.category_id}
                            onClick={() => setSelectedCategory(category.category_id)}
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
