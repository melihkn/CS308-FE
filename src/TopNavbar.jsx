import React, { useState, useContext } from "react";
import { Box, IconButton, InputBase, Button, Menu, MenuItem, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon, DarkModeOutlined, LightModeOutlined, ShoppingCart, Person as PersonIcon } from "@mui/icons-material";
import { ColorModeContext, tokens } from "./theme";
import axios from "axios";

const TopNavbar = ({ isLoggedIn, onLogout, userProfile }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null); // For dropdown
  const navigate = useNavigate();

  // Fetch the current theme
  const theme = useTheme();
  const mode = theme.palette.mode; // Get the current mode (light or dark)
  const colorMode = useContext(ColorModeContext); // For toggling the mode
  const colors = tokens(mode); // Get the color tokens for the current mode

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


      console.log(response.data);
      // Navigate to the search results page with the data
      navigate("/search-results", { state: { results: response.data } });
    } catch (error) {
      console.error("Error performing search:", error);
      alert("Failed to fetch search results. Please try again.");
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      p={2}
      sx={{
        backgroundColor: mode === "dark" ? colors.primary[800] : colors.primary[400],
        color: "white",
      }}
    >
      {/* Logo */}
      <Button
        onClick={() => navigate("/")}
        sx={{ fontSize: "24px", fontWeight: "bold", color: "white" }}
      >
        MyTech
      </Button>

      {/* Search Bar */}
      <Box
        display="flex"
        backgroundColor={mode === "dark" ? colors.primary[700] : colors.primary[500]}
        borderRadius={4}
        p={1}
        sx={{ width: "50%" }}
      >
        <InputBase
          sx={{ flex: 1, color: "white" }}
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <IconButton onClick={handleSearch} sx={{ p: 1 }}>
          <SearchIcon sx={{ color: "white" }} />
        </IconButton>
      </Box>

      {/* Right-side Buttons */}
      <Box display="flex" alignItems="center" gap={2}>
        {/* Theme Toggle */}
        <IconButton onClick={colorMode.toggleColorMode}>
          {mode === "dark" ? <LightModeOutlined sx={{ color: "white" }} /> : <DarkModeOutlined sx={{ color: "white" }} />}
        </IconButton>

        {/* Login/Register or Profile Dropdown */}
        {isLoggedIn ? (
          <>
            <Button onClick={handleMenuClick} sx={{ color: "white" }}>
                {userProfile.name} <PersonIcon />
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              sx={{
                mt: "10px",
                "& .MuiPaper-root": {
                  borderRadius: "10px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                  backgroundColor: mode === "dark" ? colors.primary[700] : "#f9f9f9",
                },
              }}
            >
              <MenuItem
                onClick={() => navigate("/profile")}
                sx={{
                  padding: "10px 20px",
                  fontWeight: "500",
                  "&:hover": {
                    backgroundColor: mode === "dark" ? colors.primary[600] : "#e0e0e0",
                    color: mode === "dark" ? "#ffffff" : "#000000",
                  },
                }}
              >
                 Profile
              </MenuItem>
              <MenuItem
                onClick={() => navigate("/orders")}
                sx={{
                  padding: "10px 20px",
                  fontWeight: "500",
                  "&:hover": {
                    backgroundColor: mode === "dark" ? colors.primary[600] : "#e0e0e0",
                    color: mode === "dark" ? "#ffffff" : "#000000",
                  },
                }}
              >
                Orders
              </MenuItem>
              <MenuItem
                onClick={() => navigate("/wishlists")}
                sx={{
                  padding: "10px 20px",
                  fontWeight: "500",
                  "&:hover": {
                    backgroundColor: mode === "dark" ? colors.primary[600] : "#e0e0e0",
                    color: mode === "dark" ? "#ffffff" : "#000000",
                  },
                }}
              >
                Wishlists
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onLogout();
                  handleMenuClose();
                }}
                sx={{
                  padding: "10px 20px",
                  fontWeight: "500",
                  color: "red",
                  "&:hover": {
                    backgroundColor: mode === "dark" ? colors.primary[600] : "#e0e0e0",
                  },
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Button onClick={handleMenuClick} sx={{ color: "white" }}>
              Login
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              sx={{
                mt: "10px",
                "& .MuiPaper-root": {
                  borderRadius: "10px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                  backgroundColor: mode === "dark" ? colors.primary[700] : "#f9f9f9",
                },
              }}
            >
              <MenuItem
                onClick={() => navigate("/login")}
                sx={{
                  padding: "10px 20px",
                  fontWeight: "500",
                  "&:hover": {
                    backgroundColor: mode === "dark" ? colors.primary[600] : "#e0e0e0",
                    color: mode === "dark" ? "#ffffff" : "#000000",
                  },
                }}
              >
                Login
              </MenuItem>
              <MenuItem
                onClick={() => navigate("/register")}
                sx={{
                  padding: "10px 20px",
                  fontWeight: "500",
                  "&:hover": {
                    backgroundColor: mode === "dark" ? colors.primary[600] : "#e0e0e0",
                    color: mode === "dark" ? "#ffffff" : "#000000",
                  },
                }}
              >
                Register
              </MenuItem>
            </Menu>
          </>
        )}


        {/* Cart Button */}
        <IconButton onClick={() => navigate("/cart")} sx={{ color: "white" }}>
          <ShoppingCart />
        </IconButton>
      </Box>
    </Box>
  );
};

export default TopNavbar;


