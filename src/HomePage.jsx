import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Typography,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";

import ProductCard from "./ProductCard";

/*
  Enhanced HomePage Component with Material-UI
  
  Features:
    - Displays a grid of products with enhanced visuals.
    - Responsive design for better usability on all devices.
    - Uses Material-UI components for a modern look.
*/

const HomePage = ({ userId, isLoggedIn }) => {
  const [products, setProducts] = useState([]);
  const [product_id, setProduct_id] = useState(null);
  const BACKEND_URL = "http://127.0.0.1:8002";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/products`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const getImageUrl = (imageUrl) => `${BACKEND_URL}/static/${imageUrl}`;

  return (
    <Container maxWidth="lg" sx={{ padding: "20px" }}>
      {/* Welcome Section */}
      <Typography variant="h3" align="center" gutterBottom>
        Welcome to MyVet!
      </Typography>
      <Typography variant="subtitle1" align="center" gutterBottom>
        Your one-stop shop for all your pet needs.
      </Typography>

      {/* Products Grid */}
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
    </Container>
  );
};

export default HomePage;
