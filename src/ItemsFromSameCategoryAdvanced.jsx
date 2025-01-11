/*import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Grid, Box, CircularProgress, Typography, Paper, Container } from "@mui/material";
import Filters from "./Filters";
import ISFG_Product_Listing from "./ISFG_Product_Listing";

function ItemsFromSameCategoryAdvanced() {
  const { categoryId } = useParams(); // Extract categoryId from URL
  const BACKEND_URL = "http://127.0.0.1:8002";
  const [filters, setFilters] = useState({
    sub_category: null, // ID of the subcategories of the selected category
    price_min: null,
    price_max: null,
    rating_min: null,
    warranty_status: null,
  });
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch subcategories and initial products for the root category
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch subcategories
        const subcategoriesResponse = await axios.get(
          `${BACKEND_URL}/products/categories/parent/${categoryId}`
        );
        setSubcategories(subcategoriesResponse.data);

        // Fetch products
        const productsResponse = await axios.get(
          `${BACKEND_URL}/products/getproduct/category/detailed/${categoryId}`
        );
        setProducts(productsResponse.data);
      } catch (error) {
        console.error("Error fetching category data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]); // Dependency

  const fetchFilteredProducts = async () => {
    try {
      console.log(filters);
      const response = await axios.post(
        `${BACKEND_URL}/products/filterproducts/category/${categoryId}`,
        filters
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching filtered products:", error);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...newFilters
    }));
  };

  const handleApplyFilters = () => {
    fetchFilteredProducts();
  };

  const handleResetFilters = async () => {
    setFilters({
      sub_category: null,
      price_min: null,
      price_max: null,
      rating_min: null,
      warranty_status: null, 
    });

    try {
      // Reset filters and fetch all products for the higher level category
      const response = await axios.get(
        `${BACKEND_URL}/products/getproduct/category/detailed/${categoryId}`
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error resetting filters:", error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Filters
            </Typography>
            <Filters
              filters={filters}
              subcategories={subcategories}
              onFilterChange={handleFilterChange}
              onApplyFilters={handleApplyFilters}
              onResetFilters={handleResetFilters}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={9}>
          <Typography variant="h5" gutterBottom>
            Products
          </Typography>
          {products.length > 0 ? (
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
}

export default ItemsFromSameCategoryAdvanced;
*/



import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Grid, Box, CircularProgress, Typography, Paper, Container, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import Filters from "./Filters";
import ISFG_Product_Listing from "./ISFG_Product_Listing";

function ItemsFromSameCategoryAdvanced() {
  const { categoryId } = useParams(); // Extract categoryId from URL
  const BACKEND_URL = "http://127.0.0.1:8002";
  const [filters, setFilters] = useState({
    sub_category: null, // ID of the subcategories of the selected category
    price_min: null,
    price_max: null,
    rating_min: null,
    warranty_status: false,
  });
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortCriteria, setSortCriteria] = useState(""); // Track selected sort option

  // Fetch subcategories and initial products for the root category
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch subcategories
        const subcategoriesResponse = await axios.get(
          `${BACKEND_URL}/products/categories/parent/${categoryId}`
        );
        setSubcategories(subcategoriesResponse.data);

        // Fetch products
        const productsResponse = await axios.get(
          `${BACKEND_URL}/products/getproduct/category/detailed/${categoryId}`
        );
        setProducts(productsResponse.data);
        setSortedProducts(productsResponse.data); // Initialize sorted products
      } catch (error) {
        console.error("Error fetching category data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]); // Dependency

  const fetchFilteredProducts = async () => {
    try {
      // Validate filters to ensure no negative numbers and rating is between 0 and 5
      const validatedFilters = { ...filters }; 
      if (validatedFilters.price_min < 0) validatedFilters.price_min = 0;
      if (validatedFilters.price_max < 0) validatedFilters.price_max = 0;
      if (validatedFilters.rating_min < 0) validatedFilters.rating_min = 0;
      if (validatedFilters.rating_min > 5) validatedFilters.rating_min = 5;
      if (validatedFilters.warranty_status < 0 ) validatedFilters.warranty_status = 0;
      // if sub_category is not selected, set it to the current category
      if (validatedFilters.sub_category === "") validatedFilters.sub_category = categoryId;

      const response = await axios.post(
        `${BACKEND_URL}/products/filterproducts/category/${categoryId}`,
        validatedFilters
      );
      setProducts(response.data);
      setSortedProducts(response.data); // Update sorted products after filtering
    } catch (error) {
      console.error("Error fetching filtered products:", error);
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

  const handleResetFilters = async () => {
    setFilters({
      sub_category: null,
      price_min: null,
      price_max: null,
      rating_min: null,
      warranty_status: false,
    });

    try {
      const response = await axios.get(
        `${BACKEND_URL}/products/getproduct/category/detailed/${categoryId}`
      );
      setProducts(response.data);
      setSortedProducts(response.data); // Reset sorted products
    } catch (error) {
      console.error("Error resetting filters:", error);
    }
  };

  // Sorting function
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
    setSortedProducts(sorted);
    setSortCriteria(criteria);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Filters Section */}
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Filters
            </Typography>
            <Filters
              filters={filters}
              subcategories={subcategories}
              onFilterChange={handleFilterChange}
              onApplyFilters={handleApplyFilters}
              onResetFilters={handleResetFilters}
            />
          </Paper>
        </Grid>

        {/* Products Section */}
        <Grid item xs={12} md={9}>
          <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h5" gutterBottom>
              Products
            </Typography>
            <FormControl>
              <InputLabel id="sort-label">Sort by</InputLabel>
              <Select
                labelId="sort-label"
                value={sortCriteria}
                onChange={(e) => sortItems(e.target.value)}
                sx={{ minWidth: 150 }}
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="price (ascending)">Price (Low to High)</MenuItem>
                <MenuItem value="price (descending)">Price (High to Low)</MenuItem>
                <MenuItem value="name (A-Z)">Name (A-Z)</MenuItem>
                <MenuItem value="name (Z-A)">Name (Z-A)</MenuItem>
                <MenuItem value="popularity">Popularity (Most Sold)</MenuItem>
              </Select>
            </FormControl>
          </Box>
          {sortedProducts.length > 0 ? (
            <ISFG_Product_Listing products={sortedProducts} />
          ) : (
            <Typography variant="body1" color="textSecondary">
              No products found.
            </Typography>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default ItemsFromSameCategoryAdvanced;
