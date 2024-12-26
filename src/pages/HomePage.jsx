import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typography, Container, Box, Button } from "@mui/material";
import Grid from "@mui/material/Grid";
import ProductCard from "../components/ProductCard";
import Carousel from "react-material-ui-carousel";

const HomePage = ({ isLoggedIn, userId, selectedCategory }) => {
  const [products, setProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const BACKEND_URL = "http://127.0.0.1:8002";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = selectedCategory
          ? `${BACKEND_URL}/products/getproduct/category/${selectedCategory}`
          : `${BACKEND_URL}/products`;
        const response = await axios.get(url);
        const allProducts = response.data;
        setProducts(allProducts);

        const sortedProducts = [...allProducts]
          .sort((a, b) => b.item_sold - a.item_sold)
          .slice(0, 10);
        setPopularProducts(sortedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchDiscountedProducts = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/products/discounted`);
        const discounted = response.data;
        setDiscountedProducts(discounted);
      } catch (error) {
        console.error("Error fetching discounted products:", error);
      }
    };

    fetchProducts();
    fetchDiscountedProducts();
  }, [selectedCategory]);

  const getImageUrl = (imageUrl) => `${BACKEND_URL}/static/${imageUrl}`;

  return (
    <Container maxWidth="lg" sx={{ padding: "20px" }}>
      <Typography variant="h3" align="center" gutterBottom>
        Welcome to MyTech!
      </Typography>
      <Typography variant="subtitle1" align="center" gutterBottom>
        Your one-stop shop for all your tech needs.
      </Typography>
      <Box sx={{ marginTop: "30px", marginBottom: "30px", height: "600px" }}>
        <Carousel
          animation="slide"
          navButtonsAlwaysVisible
          indicators={false}
          sx={{ minHeight: "400px" }}
        >
          <Box
            sx={{
              minHeight: "500px",
              height: "100%",
              backgroundColor: "#e0e0e0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              padding: "20px",
              overflow: "visible",
            }}
          >
            <Typography variant="h4" align="center" gutterBottom>
              Discounted Products
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              {discountedProducts.slice(0, 3).map((product) => (
                <Grid item key={product.product_id} xs={12} sm={4}>
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
          </Box>
          <Box
            sx={{
              minHeight: "500px",
              height: "100%",
              backgroundColor: "#d3d3d3",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              padding: "20px",
              overflow: "visible",
            }}
          >
            <Typography variant="h4" align="center" gutterBottom>
              Promotion 2: Limited Time Offer!
            </Typography>
            <Button variant="contained" color="primary" sx={{ marginTop: "20px" }}>
              Shop Now
            </Button>
          </Box>
        </Carousel>
      </Box>
      <Typography variant="h4" align="center" gutterBottom>
        Popular Products
      </Typography>
      <Grid container spacing={4} sx={{ mt: 3 }}>
        {popularProducts.map((product) => (
          <Grid item key={product.product_id} xs={12} sm={6} md={4} lg={3}>
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

      <Typography variant="h4" align="center" gutterBottom sx={{ mt: 5 }}>
        All Products
      </Typography>
      <Grid container spacing={4} sx={{ mt: 3 }}>
        {products.map((product) => (
          <Grid item key={product.product_id} xs={12} sm={6} md={4} lg={3}>
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

