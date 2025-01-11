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

  const [products, setProducts] = useState(initialResults);
  const [filters, setFilters] = useState({
    price_min: null,
    price_max: null,
    rating_min: null,
  });
  const [loading, setLoading] = useState(false);

  // Fetch filtered products
  const fetchFilteredProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/products/filter-search`, filters);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching filtered products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

  const handleApplyFilters = () => {
    fetchFilteredProducts();
  };

  const handleResetFilters = () => {
    setFilters({
      price_min: null,
      price_max: null,
      rating_min: null,
    });
    setProducts(initialResults); // Reset to initial search results
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
