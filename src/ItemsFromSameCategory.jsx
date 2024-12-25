import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typography, Container, Grid, Box } from "@mui/material";
import ProductCard from "./ProductCard";
import { useParams } from "react-router-dom";

const ItemsFromSameCategory = ({ isLoggedIn, userId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BACKEND_URL = "http://127.0.0.1:8002";
  const { categoryId } = useParams(); // Extract categoryId from URL

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BACKEND_URL}/products/getproduct/category/detailed/${categoryId}`);
        if (response.data.length === 0) {
          setError("No products available in this category.");
        } else {
          setProducts(response.data);
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching products for category:", err);
        setError("Failed to fetch products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  const getImageUrl = (imageUrl) => `${BACKEND_URL}/static/${imageUrl}`;

  return (
    <Container maxWidth="lg" sx={{ padding: "20px" }}>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <Typography variant="h6">Loading products...</Typography>
        </Box>
      ) : error ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <Typography variant="h6">{error}</Typography>
        </Box>
      ) : (
        <Grid container spacing={4} sx={{ mt: 3 }}>
          {products.map((product) => (
            <Grid item key={product.product_id} xs={12} sm={6} md={4}>
              <ProductCard
                userId={userId}
                isLoggedIn={isLoggedIn}
                id={product.product_id}
                name={product.name}
                model={product.model}
                description={product.description}
                quantity={product.quantity}
                distributor={product.distributor}
                imageUrl={getImageUrl(product.image_url)}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ItemsFromSameCategory;
