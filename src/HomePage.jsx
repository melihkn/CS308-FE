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

/*
  Enhanced HomePage Component with Material-UI
  
  Features:
    - Displays a grid of products with enhanced visuals.
    - Responsive design for better usability on all devices.
    - Uses Material-UI components for a modern look.
*/

const HomePage = () => {
  const [products, setProducts] = useState([]);
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
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.product_id}>
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <CardMedia
                component="img"
                image={getImageUrl(product.image_url)}
                alt={product.name}
                sx={{ height: 200 }}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Model:</strong> {product.model}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {product.description}
                </Typography>
                <Typography variant="body1">
                  <strong>Price:</strong> ${product.price}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Quantity:</strong> {product.quantity}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  component={Link}
                  to={`/product-detail/${product.product_id}`}
                  size="small"
                  color="primary"
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HomePage;
