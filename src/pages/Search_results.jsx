import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
  Grid,
  Container,
  CircularProgress,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import FiltersSearch from "../FiltersSearch";
import ISFG_Product_Listing from "./ISFG_Product_Listing";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";

const SearchResults = () => {
  const location = useLocation();
  const BACKEND_URL = "http://127.0.0.1:8002";
  const initialResults = location.state?.results || [];

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [allProducts, setAllProducts] = useState(initialResults); // Full list of products
  const [products, setProducts] = useState(initialResults); // Filtered products
  const [filters, setFilters] = useState({
    price_min: null,
    price_max: null,
    rating_min: null,
  });
  const [loading, setLoading] = useState(false);
  const [sortCriteria, setSortCriteria] = useState(""); // Track selected sort option

  // Fetch products from backend if not provided in location.state
  useEffect(() => {
    if (location.state?.results) {
      setAllProducts(location.state.results);
      setProducts(location.state.results);
    } else {
      fetchProductsFromBackend();
    }
  }, [location.state]);

  const fetchProductsFromBackend = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/products`);
      setAllProducts(response.data);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    const filteredProducts = allProducts.filter((product) => {
      const matchesPrice =
        (!filters.price_min || product.price >= filters.price_min) &&
        (!filters.price_max || product.price <= filters.price_max);

      const matchesRating =
        !filters.rating_min || product.average_rating >= filters.rating_min;

      const matchesWarranty =
        !filters.warranty_status || product.warranty_status >= filters.warranty_status;

      return matchesPrice && matchesRating && matchesWarranty;
    });

    setProducts(filteredProducts);
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      price_min: null,
      price_max: null,
      rating_min: null,
    });
    setProducts(allProducts); // Reset to show all products
  };

  const sortItems = (criteria) => {
    let sorted = [];
    if (criteria === "price (ascending)") {
      sorted = [...products].sort((a, b) => a.price - b.price);
    } else if (criteria === "price (descending)") {
      sorted = [...products].sort((a, b) => b.price - a.price);
    } else if (criteria === "name (A-Z)") {
      sorted = [...products].sort((a, b) => a.name.localeCompare(b.name));
    } else if (criteria === "name (Z-A)") {
      sorted = [...products].sort((a, b) => b.name.localeCompare(a.name));
    } else if (criteria === "popularity") {
      sorted = [...products].sort((a, b) => b.item_sold - a.item_sold);
    }

    setProducts(sorted);
    setSortCriteria(criteria);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4, pl:0}}>
      <Grid container spacing={3}>
        {/* Filters Section */}
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <FiltersSearch
              filters={filters}
              onFilterChange={handleFilterChange}
              onApplyFilters={handleApplyFilters}
              onResetFilters={handleResetFilters}
            />
          </Paper>
        </Grid>

        {/* Products Section */}
        <Grid item xs={12} md={9}>
          <Box
            sx={{
              mb: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" gutterBottom>
              Search Results
            </Typography>
            <FormControl
              sx={{
                minWidth: 150,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor:
                      theme.palette.mode === "dark"
                        ? colors.blueAccent[200]
                        : "rgba(0, 0, 0, 0.23)",
                  },
                  "&:hover fieldset": {
                    borderColor:
                      theme.palette.mode === "dark"
                        ? colors.grey[700]
                        : "rgba(0, 0, 0, 0.87)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: colors.blueAccent[100],
                    borderWidth: "2px",
                  },
                },
                input: {
                  color: theme.palette.text.primary,
                },
                "& .MuiInputLabel-root": {
                  color: theme.palette.text.secondary,
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: colors.blueAccent[100],
                },
              }}
            >
              <InputLabel id="sort-label">Sort by</InputLabel>
              <Select
                labelId="sort-label"
                value={sortCriteria}
                onChange={(e) => sortItems(e.target.value)}
              >
                <MenuItem value="price (ascending)">Price (Low to High)</MenuItem>
                <MenuItem value="price (descending)">Price (High to Low)</MenuItem>
                <MenuItem value="name (A-Z)">Name (A-Z)</MenuItem>
                <MenuItem value="name (Z-A)">Name (Z-A)</MenuItem>
                <MenuItem value="popularity">Popularity (Most Sold)</MenuItem>
              </Select>
            </FormControl>
          </Box>
          {loading ? (
            <CircularProgress />
          ) : products.length > 0 ? (
            <ISFG_Product_Listing products={products} />
          ) : (
            <Typography variant="body1" color="textSecondary">
              No products found.
            </Typography>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default SearchResults;


/*
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Grid, Container, CircularProgress, Typography, Paper } from "@mui/material";
import FiltersSearch from "../FiltersSearch";
import ISFG_Product_Listing from "./ISFG_Product_Listing";

const SearchResults = () => {
  const location = useLocation();
  const BACKEND_URL = "http://127.0.0.1:8002";
  const initialResults = location.state?.results || [];

  const [allProducts, setAllProducts] = useState(initialResults); // Full list of products
  const [products, setProducts] = useState(initialResults); // Filtered products
  const [filters, setFilters] = useState({
    price_min: null,
    price_max: null,
    rating_min: null,
  });
  const [loading, setLoading] = useState(false);

  // Fetch products from backend if not provided in location.state
  useEffect(() => {
    if (location.state?.results) {
      setAllProducts(location.state.results);
      setProducts(location.state.results);
    } else {
      fetchProductsFromBackend();
    }
  }, [location.state]);

  const fetchProductsFromBackend = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/products`);
      setAllProducts(response.data);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    console.log("Applying filters:", allProducts);
    const filteredProducts = allProducts.filter((product) => {
      const matchesPrice =
        (!filters.price_min || product.price >= filters.price_min) &&
        (!filters.price_max || product.price <= filters.price_max);

      const matchesRating =
        !filters.rating_min || product.average_rating >= filters.rating_min; // Ensure this works with product.rating
  
      return matchesPrice && matchesRating;
    });
  
    setProducts(filteredProducts);
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      price_min: null,
      price_max: null,
      rating_min: null,
    });
    setProducts(allProducts); // Reset to show all products
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
    
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <FiltersSearch
              filters={filters}
              onFilterChange={handleFilterChange}
              onApplyFilters={handleApplyFilters}
              onResetFilters={handleResetFilters}
            />
          </Paper>
        </Grid>


        <Grid item xs={12} md={9}>
          {loading ? (
            <CircularProgress />
          ) : products.length > 0 ? (
            <ISFG_Product_Listing products={products} />
          ) : (
            <Typography variant="body1" color="textSecondary">
              No products found.
            </Typography>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default SearchResults;
*/