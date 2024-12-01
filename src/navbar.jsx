import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  TextField,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LogoutIcon from "@mui/icons-material/Logout";

/*
  Navbar Component with Material-UI and a Slightly Darker Orange Theme

  Props:
    - isLoggedIn: boolean to check if the user is logged in or not
    - userProfile: user profile information such as email, name, surname, phone number 
    - onLogout: function to log out the user by removing the token from local storage
    - onSearch: function to handle the search query

  Features:
    - Displays login/register links if not logged in.
    - Displays profile, cart, orders, and logout links if logged in.
    - Search bar included for product search.
*/

const Navbar = ({ isLoggedIn, userProfile, onLogout, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await onSearch(searchQuery);
      navigate("/search-results", { state: { results: response } });
    } catch (error) {
      console.error("Error performing search:", error.message);
    }
  };

  return (
    <AppBar position="static" sx={{ bgcolor: "#ff7f24" }}> {/* Subtle darker orange */}
      <Toolbar>
        {/* Brand Logo */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            textDecoration: "none",
            color: "white",
            fontWeight: "bold",
            mr: 2, // Add margin to separate the logo and search bar
          }}
        >
          MyVET
        </Typography>

        {/* Search Bar */}
        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1, // Allow the search bar to grow
            ml: 1, // Shift search bar slightly to the left
            mr: 2, // Add spacing before the user buttons
          }}
        >
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              flexGrow: 1, // Allow the search bar to expand
              maxWidth: "500px", // Set a maximum width for the search bar
              backgroundColor: "white",
              borderRadius: 1,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#ff7f24", // Match the subtle darker orange
                },
                "&:hover fieldset": {
                  borderColor: "#e67320", // Slightly darker hover effect
                },
              },
            }}
          />
          <IconButton type="submit" sx={{ color: "white" }}>
            <SearchIcon />
          </IconButton>
        </Box>

        {/* Navigation Links */}
        {isLoggedIn ? (
          <>
            <Typography variant="body1" sx={{ mx: 2, color: "white" }}>
              Hello, {userProfile?.email}
            </Typography>

            <Button
              component={Link}
              to="/profile"
              sx={{ color: "white" }}
              startIcon={<AccountCircleIcon />}
            >
              Profile
            </Button>
            {userProfile?.role === "product_manager" && (
              <Button
                component={Link}
                to="/ProductManager"
                sx={{ color: "white" }}
                startIcon={<AccountCircleIcon />}
              >
                Manager
              </Button>
            )}
            <Button
              component={Link}
              to="/orders"
              sx={{ color: "white" }}
              startIcon={<ShoppingCartIcon />}
            >
              Orders
            </Button>
            <Button
              component={Link}
              to="/cart"
              sx={{ color: "white" }}
              startIcon={<ShoppingCartIcon />}
            >
              Cart
            </Button>
            <Button
              onClick={onLogout}
              sx={{ color: "white" }}
              startIcon={<LogoutIcon />}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button component={Link} to="/orders" sx={{ color: "white" }}>
              Orders
            </Button>
            <Button component={Link} to="/cart" sx={{ color: "white" }}>
              Cart
            </Button>
            <Button component={Link} to="/login" sx={{ color: "white" }}>
              Login
            </Button>
            <Button component={Link} to="/register" sx={{ color: "white" }}>
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
