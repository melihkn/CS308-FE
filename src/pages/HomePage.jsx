
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typography, Container, Grid, Box, Button } from "@mui/material";
import ProductCard from "../components/ProductCard";
import Carousel from "react-material-ui-carousel";
import {useTheme} from "@mui/material";
import { tokens } from "../theme";

const HomePage = ({ isLoggedIn, userId, selectedCategory }) => {
  const [products, setProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [discountedProductsRate, setDiscountedProductsByRate] = useState([]);
  const [discountedProductsEndDate, setDiscountedProductsByEndDate] = useState([]);
  const BACKEND_URL = "http://127.0.0.1:8002";
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

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

    const fetchDiscountedProductsByRate = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/products/products/discounted-by-rate`);
        const discounted = response.data;
        setDiscountedProductsByRate(discounted);
      } catch (error) {
        console.error("Error fetching discounted products:", error);
      }
    };
    const fetchDiscountedProductsByEndDate = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/products/products/discounted-by-end-date`);
        const discounted = response.data;
        setDiscountedProductsByEndDate(discounted);
      } catch (error) {
        console.error("Error fetching discounted products:", error);
      }
    };

    fetchProducts();
    fetchDiscountedProductsByRate();
    fetchDiscountedProductsByEndDate();
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
          backgroundColor: colors.primary,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: "20px",
          overflow: "visible",
        }}
        >
        <Typography variant="h4" align="center" gutterBottom>
          Big Discounts!
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {discountedProductsRate.slice(0, 3).map((product) => (
          <Grid item key={product.product_id} xs={12} sm={4}>
            <ProductCard
            userId={userId}
            isLoggedIn={isLoggedIn}
            id={product.product_id}
            name={product.name}
            model={product.model}
            price={product.price}
            description={product.description}
            quantity={product.quantity}
            distributor={product.distributor}
            imageUrl={getImageUrl(product.image_url)}
            discountRate={product.discount_rate}
            />
          </Grid>
          ))}
        </Grid>
        </Box>
        <Box
        sx={{
          minHeight: "500px",
          height: "100%",
          backgroundColor: colors.blueAccent,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: "20px",
          overflow: "visible",
        }}
        >
        <Typography variant="h4" align="center" gutterBottom>
          Limited Time Offers!
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {discountedProductsEndDate.slice(0, 3).map((product) => (
          <Grid item key={product.product_id} xs={12} sm={4}>
            <ProductCard
            userId={userId}
            isLoggedIn={isLoggedIn}
            id={product.product_id}
            name={product.name}
            model={product.model}
            price={product.price}
            description={product.description}
            quantity={product.quantity}
            distributor={product.distributor}
            imageUrl={getImageUrl(product.image_url)}
            discountRate={product.discount_rate}
            />
          </Grid>
          ))}
        </Grid>
        </Box>
      </Carousel>
      </Box>
      <Typography variant="h4" align="center" gutterBottom>
      Popular Products
      </Typography>
      <Grid container spacing={4} sx={{ mt: 3 }}>
      {popularProducts.map((product) => {
        const discountedProduct = discountedProductsRate.find(
        (discounted) => discounted.product_id === product.product_id
        );
        const discountRate = discountedProduct ? discountedProduct.discount_rate : 0;
        return (
        <Grid item key={product.product_id} xs={12} sm={6} md={4} lg={3}>
          <ProductCard
          userId={userId}
          isLoggedIn={isLoggedIn}
          id={product.product_id}
          name={product.name}
          model={product.model}
          price={product.price}
          description={product.description}
          quantity={product.quantity}
          distributor={product.distributor}
          imageUrl={getImageUrl(product.image_url)}
          discountRate={discountRate}
          />
        </Grid>
        );
      })}
      </Grid>

      <Typography variant="h4" align="center" gutterBottom sx={{ mt: 5 }}>
      All Products
      </Typography>
      <Grid container spacing={4} sx={{ mt: 3 }}>
      {products.map((product) => {
        const discountedProduct = discountedProductsRate.find(
        (discounted) => discounted.product_id === product.product_id
        );
        const discountRate = discountedProduct ? discountedProduct.discount_rate : 0;
        return (
        <Grid item key={product.product_id} xs={12} sm={6} md={4} lg={3}>
          <ProductCard
          userId={userId}
          isLoggedIn={isLoggedIn}
          id={product.product_id}
          name={product.name}
          model={product.model}
          price={product.price}
          description={product.description}
          quantity={product.quantity}
          distributor={product.distributor}
          imageUrl={getImageUrl(product.image_url)}
          discountRate={discountRate}
          />
        </Grid>
        );
      })}
      </Grid>
    </Container>
    );
};

export default HomePage;

