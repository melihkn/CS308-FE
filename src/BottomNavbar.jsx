
import React, { useState, useEffect, useContext } from "react";
import { Box, Button, Menu, MenuItem, CircularProgress, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ColorModeContext, tokens } from "./theme";

const BottomNavbar = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null); // For "All Products" dropdown
  const navigate = useNavigate();

  // Use theme and color mode
  const theme = useTheme();
  const mode = theme.palette.mode;
  const colors = tokens(mode);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8002/products/categories/root");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/items-from-same-category/${categoryId}`);
    handleMenuClose();
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          backgroundColor: mode === "dark" ? colors.primary[800] : "#ffffff",
          py: 2,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      sx={{
        backgroundColor: mode === "dark" ? colors.primary[800] : "#ffffff",
        color: mode === "dark" ? "#ffffff" : "#000000",
        py: 1,
        boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      {/* All Products Dropdown */}
      <Button
        onClick={handleMenuOpen}
        sx={{
          color: mode === "dark" ? "#ffffff" : "#000000",
          fontWeight: "bold",
          textTransform: "none",
        }}
      >
        Tüm Ürünler
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
        {categories.map((category) => (
          <MenuItem
            key={category.category_id}
            onClick={() => handleCategoryClick(category.category_id)}
            sx={{
              color: mode === "dark" ? "#ffffff" : "#000000",
              padding: "10px 20px",
              "&:hover": {
                backgroundColor: mode === "dark" ? colors.primary[600] : "#e0e0e0",
              },
            }}
          >
            {category.category_name}
          </MenuItem>
        ))}
      </Menu>

      {/* Static Categories */}
      {categories.map((category) => (
        <Button
          key={category.category_id}
          onClick={() => handleCategoryClick(category.category_id)}
          sx={{
            color: mode === "dark" ? "#ffffff" : "#000000",
            fontWeight: "bold",
            textTransform: "none",
            mx: 2,
            "&:hover": {
              textDecoration: "underline",
              backgroundColor: mode === "dark" ? colors.primary[700] : "#f2f2f2",
              borderRadius: "5px",
            },
          }}
        >
          {category.category_name}
        </Button>
      ))}
    </Box>
  );
};

export default BottomNavbar;

