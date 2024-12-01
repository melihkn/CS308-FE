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
import axios from "axios";

const Navbar = ({ isLoggedIn, userProfile, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

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
  };

  return (
    <AppBar position="static" sx={{ bgcolor: "#ff7f24" }}>
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
            mr: 2,
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
            flexGrow: 1,
            ml: 1,
            mr: 2,
          }}
        >
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              flexGrow: 1,
              maxWidth: "500px",
              backgroundColor: "white",
              borderRadius: 1,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#ff7f24",
                },
                "&:hover fieldset": {
                  borderColor: "#e67320",
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
            <Button
              component={Link}
              to="/cart"
              sx={{ color: "white" }}
              startIcon={<ShoppingCartIcon />}
            >
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
