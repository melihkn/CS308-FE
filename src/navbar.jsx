import { Box, Button, useTheme, IconButton, InputBase } from "@mui/material"; // To use the box, button, and icon button components
import { Link, useNavigate } from "react-router-dom"; // To use the link component and navigate hook
import { useState, useContext } from "react";
import { ColorModeContext, tokens } from "./theme"; // To use the color mode context
import SearchIcon from "@mui/icons-material/Search"; // To use the search icon
import { DarkModeOutlined, LightModeOutlined, Menu as MenuIcon } from "@mui/icons-material";
import axios from "axios"; // To use the axios library

const Navbar = ({ isLoggedIn, userProfile, onLogout, toggleSidebar }) => {
    const [searchQuery, setSearchQuery] = useState(""); // To keep track of the search query
    const navigate = useNavigate(); // To navigate to different pages
    const theme = useTheme(); // To use the theme
    const colorMode = useContext(ColorModeContext); // Allows toggling between light and dark mode
    const colors = tokens(theme.palette.mode); // Correct way to pass "dark" or "light" to tokens function

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            alert("Please enter a search query.");
            return;
        }

        try {
            const response = await axios.post("http://127.0.0.1:8002/products/search", {
                query: searchQuery.trim(),
            });

            // Navigate to the search results page with the data
            navigate("/search-results", { state: { results: response.data } });
        } catch (error) {
            console.error("Error performing search:", error);
            alert("Failed to fetch search results. Please try again.");
        }
    }; // Function to handle the search functionality

    return (
        <Box display="flex" justifyContent="space-between" p={2} alignItems="center">
            {/* Sidebar Toggle Button */}
            <IconButton onClick={toggleSidebar} sx={{ p: 1 }}>
                <MenuIcon />
            </IconButton>
            

            {/* Search Bar */}
            <Box display="flex" backgroundColor={colors.background} borderRadius={4} p={1}>
                <InputBase
                    sx={{flex: 1}}
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <IconButton onClick={handleSearch} sx={{ p: 1 }}>
                    <SearchIcon />
                </IconButton>
            </Box>

            {/* Navigation Buttons */}
            <Box display="flex" gap={2}>
                {/* Toggle Color Mode Button */}
                <IconButton onClick={colorMode.toggleColorMode} sx={{ p: 1 }}>
                    {theme.palette.mode === "dark" ? <LightModeOutlined /> : <DarkModeOutlined />}
                </IconButton>
                <Button component={Link} to="/" variant="contained" color="primary">
                    Home
                </Button>
                {isLoggedIn ? (
                    <Button component={Link} to="/orders" variant="contained" color="primary">
                        Orders
                    </Button>) : null
                }
                
                <Button component={Link} to="/cart" variant="contained" color="primary">
                    Cart
                </Button>
                {isLoggedIn ? (
                    <Button component={Link} to="/profile" variant="contained" color="primary">
                        Profile
                    </Button>) : null
                }

                {isLoggedIn ? (
                    <Button onClick={onLogout} variant="contained" color="primary">
                        Logout
                    </Button>
                ) : (
                    <Button component={Link} to="/login" variant="contained" color="primary">
                        Login
                    </Button>
                )}

                {isLoggedIn ? null : (
                    <Button component={Link} to="/register" variant="contained" color="primary">
                        Register
                    </Button>)
}
            </Box>
        </Box>
    );
};

export default Navbar;
