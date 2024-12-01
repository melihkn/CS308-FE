import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  IconButton,
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Tab,
  Tabs,
  Rating,
  Button,
  TextField,
  Stack,
  CircularProgress,
} from "@mui/material";

import { Add, Remove } from "@mui/icons-material"; // For increment/decrement buttons
import { fetchProductbyId, addReview, fetchReviewsByProductId } from "./api";
import axios from "axios";

const ProductDetailPage = ({ isLoggedIn, userId }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0); // For tabs
  const [reviews, setReviews] = useState([]); // Reviews
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [quantity, setQuantity] = useState(1); // Quantity counter
  const [cartItems, setCartItems] = useState([]); // Cart items

  useEffect(() => {
    const loadProduct = async () => {
      try {

        const newId = {
          product_id: id
        };


        console.log("Fetching product from:", `/products/${id}`); // Debugging
        const data = await fetchProductbyId(id);
        setProduct(data);
        console.log("Product fetched:", data); // Debugging
        console.log("Fetching reviews for product:", id); // Debugging
        const reviews = await fetchReviewsByProductId(id);
        console.log("Reviews fetched:", reviews); // Debugging
        setReviews(reviews || []); // Assuming reviews are part of the product data
      } catch (err) {
        console.error("Error fetching product:", err.response?.data || err);
        setError("Failed to load product data.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAddReview = async () => {
    if (!rating || !comment.trim()) {
      alert("Please provide a rating and a comment.");
      return;
    }

    if (!localStorage.getItem("token")) {
      alert("Please log in to add a review.");
      setRating(0); // Reset rating
      setComment(""); // Reset comment
      return;
    }
    

      // Construct the review payload directly
    const reviewPayload = {
      product_id: id, // Include the productId
      rating : rating,
      comment : comment,
    };

    try {
      console.log("Adding review:", reviewPayload); // Debugging
      const addedReview = await addReview(reviewPayload); // Send review to backend
      const reviews = await fetchReviewsByProductId(id); // Fetch updated reviews
      setReviews(reviews); // Update reviews
      setRating(0); // Reset rating
      setComment(""); // Reset comment
    } catch (error) {
      console.error("Error adding review:", error.response?.data || error);
      alert("Failed to add review. Please try again.");
    }
  };

  const handleAddToCart = async () => {
    try {
      await addToCart({ productId: id});
      alert("Product added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error.response?.data || error);
      alert("Failed to add product to cart.");
    }
  };

  const handleAddToWishlist = async () => {
    try {
      //await addToWishlist({ productId: id });
      alert("Product added to wishlist!");
    } catch (error) {
      console.error("Error adding to wishlist:", error.response?.data || error);
      alert("Failed to add product to wishlist.");
    }
  }

  const addToCart = async (product_id) => {

    // If the user is logged in, add the item to the backend cart
    if (isLoggedIn && userId) {
      try {
        // Send a POST request to the server to add the item to the cart
        await axios.post(
          "http://127.0.0.1:8001/cart/add",
          {
            product_id: id,
            quantity: quantity,
          },
          {
            params: {
              customer_id: userId, // Add customer_id as a query parameter
            },
          }
        );
        console.log("Item added to backend cart.");
      } 
      catch (error) {
        console.error("Error adding item to backend cart:", error);
      }
    } 
    // If the user is not logged in, add the item to the session storage cart
    else {
      // Get the cart from the session storage or create an empty cart
      let cart = JSON.parse(sessionStorage.getItem("cart") || "[]");
      console.log("Cart:", cart); // Debugging
      // Find the index of the existing item in the cart
      const existingItemIndex = cart.findIndex(item => item.productId === Number(product_id));
      console.log("Existing item index:", existingItemIndex); // Debugging
      // If the item exists in the cart, increase the quantity
      if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += quantity;
      }
      // If the item does not exist in the cart, add a new item 
      else {
        cart.push({ product_id: String(id), quantity: Number(quantity) });
      }
      // Save the updated cart to the session storage
      localStorage.setItem("cart", JSON.stringify(cart));
      // Update the cart items state with the updated cart
      setCartItems(cart);
    }
  };


  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1)); // Prevent quantity from going below 1
  };

  if (loading) return <CircularProgress />;
  if (error)
    return (
      <Typography color="error" variant="h6">
        {error}
      </Typography>
    );

  return (
    <Container sx={{ padding: 4 }}>
      <Paper sx={{ padding: 4, marginBottom: 4 }}>
        <Grid container spacing={4}>
          {/* Product Image */}
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={`http://127.0.0.1:8002/static/${product.image_url}`}
              alt={product.name}
              sx={{
                width: "100%",
                maxWidth: 400,
                borderRadius: 2,
                boxShadow: 2,
              }}
            />
          </Grid>

          {/* Product Details */}
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>
              {product.name}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {product.description}
            </Typography>
            <Typography variant="body2" gutterBottom>
              {product.distributor}
            </Typography>
            <Typography
              variant="h5"
              color="primary"
              fontWeight="bold"
              gutterBottom
            >
              {(product.price ?? 0).toLocaleString("tr-TR")} TL
            </Typography>
            {/* Quantity Counter */}
            <Stack direction="row" alignItems="center" spacing={2} mt={2}>
              <IconButton onClick={decrementQuantity} color="primary">
                <Remove />
              </IconButton>
              <Typography variant="h6">{quantity}</Typography>
              <IconButton onClick={incrementQuantity} color="primary">
                <Add />
              </IconButton>
            </Stack>
            <Stack direction="row" spacing={2} mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleAddToWishlist}
              >
                Add to Wishlist
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs Section */}
      <Paper>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Product Description" />
          <Tab label={`Reviews (${reviews.length})`} />
        </Tabs>

        {tabValue === 0 && (
          <Box sx={{ padding: 4 }}>
            <Typography variant="h6" gutterBottom>
              Product Description
            </Typography>
            <Typography>
              {product.description || "No description available."}
            </Typography>
          </Box>
        )}

        {tabValue === 1 && (
          <Box sx={{ padding: 4 }}>
            <Typography variant="h6" gutterBottom>
              Add a Review
            </Typography>
            <Stack spacing={2}>
              <Rating
                value={rating}
                onChange={(e, newValue) => setRating(newValue)}
              />
              <TextField
                label="Comment"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddReview}
              >
                Submit Review
              </Button>
            </Stack>

            <Box mt={4}>
              <Typography variant="h6" gutterBottom>
                Reviews
              </Typography>
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <Paper
                    key={review.id}
                    sx={{ padding: 2, marginBottom: 2 }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Rating value={review.rating} precision={0.1} readOnly />
                      <Typography variant="body1">
                        {review.user}: {review.comment}
                      </Typography>
                    </Stack>
                  </Paper>
                ))
              ) : (
                <Typography>No reviews yet. Be the first to review!</Typography>
              )}
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ProductDetailPage;
