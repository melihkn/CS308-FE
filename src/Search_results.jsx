import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Grid, Container, CircularProgress, Typography, Paper } from "@mui/material";
import FiltersSearch from "./FiltersSearch";
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
