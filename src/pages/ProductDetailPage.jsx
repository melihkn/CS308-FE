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
  Snackbar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  colors,
} from "@mui/material";
import {tokens} from "../theme";  
import {useTheme} from "@mui/material";


import { ShoppingCart } from "@mui/icons-material";

import { Add, Remove } from "@mui/icons-material"; // For increment/decrement buttons
import { fetchProductbyId, addReview, fetchReviewsByProductId, fetchAverageRating } from "../api/api";
import axios from "axios";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const ProductDetailPage = ({ isLoggedIn, userId }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0); // For tabs
  const [reviews, setReviews] = useState([]); // Reviews
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [quantity, setQuantity] = useState(1); // Quantity counter
  const [cartItems, setCartItems] = useState([]); // Cart items
  const [averageRating, setAverageRating] = useState(0);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [wishlistDialogOpen, setWishlistDialogOpen] = useState(false);
  const [wishlists, setWishlists] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

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
        const avrgRating = await fetchAverageRating(id);
        setAverageRating(avrgRating);
        console.log("Average rating fetched:", avrgRating); // Debugging
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
      var new_average = averageRating;
      if (reviewPayload.comment === "") {
        new_average = (averageRating * (reviews.length-1) + rating) / (reviews.length);
        console.log("New average rating:", new_average); // Debugging
        const updatedReviews = [...reviews, addedReview]; // Add the new review to the existing reviews
        setReviews(updatedReviews); // Update the reviews state
      }
      setAverageRating(new_average);
      setRating(0); // Reset rating
      setComment(""); // Reset comment
      setSnackbar({ open: true, message: "Review added successfully", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error fetching invoice', severity: 'error' });
      console.error("Error adding review:", error.response?.data || error);
    }
  };

  const handleAddToCart = async () => {
    try {
      const result = await addToCart({ productId: id});
      console.log("Result:", result);
      if (result !== "Could not add item to cart.")
      alert("Product added to cart!");
    } catch (httpError) {
      // Differentiate error responses based on status codes or messages
      const errorDetail = httpError.response?.data?.detail;

      if (httpError.response?.status === 400 && errorDetail === "Stock is not enough.") {
        alert("Stock is not enough! Please reduce the quantity or try again later.");
      } else if (httpError.response?.status === 400) {
        alert("Bad Request: " + (errorDetail || "Invalid request."));
      } else if (httpError.response?.status === 404) {
        alert("Product not found!");
      } else if (httpError.response?.status === 500) {
        alert("Internal server error! Please try again later.");
      } else {
        alert("Failed to add product to cart: " + (errorDetail || httpError.message));
      }
      console.error("Error adding to cart:", httpError.response?.data || httpError);
    }
  };

  const handleAddToWishlist = async () => {
    if (!isLoggedIn) {
      console.error("User is not logged in", isLoggedIn);
      setSnackbarMessage("User must be logged in");
      setSnackbarOpen(true);
      return;
    }
    
    try {
      const response = await axios.get(`http://127.0.0.1:8005/api/wishlists/get/${localStorage.getItem("token")}`);
      setWishlists(response.data);
      setWishlistDialogOpen(true);
    } catch (error) {
      console.error("Error fetching wishlists:", error.response?.data || error);
      setSnackbarMessage("Failed to fetch wishlists.");
      setSnackbarOpen(true);
    }
  };
  const handleSelectWishlist = async (wishlistId) => {
    try {
      await axios.post(`http://127.0.0.1:8005/api/wishlist_items/create`, {
        wishlist_id: wishlistId,
        product_id: id
      });
      setSnackbarMessage("Product added to wishlist successfully!");
      setSnackbarOpen(true);
      setWishlistDialogOpen(false);
    } catch (error) {
      console.error("Error adding product to wishlist:", error.response?.data || error);
      setSnackbarMessage("Failed to add product to wishlist. It may already exist in the wishlist");
      console.log(error.response.data)
      setSnackbarOpen(true);
    }
  };

  const addToCart = async (product_id) => {

    // If the user is logged in, add the item to the backend cart
    if (isLoggedIn && userId) {
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
    // If the user is not logged in, add the item to the session storage cart
    else {
      // Get the cart from the session storage or create an empty cart
      let cart = JSON.parse(localStorage.getItem("cart") || "[]");
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

  const [newWishlistName, setNewWishlistName] = useState("");

  const handleCreateWishlist = async () => {
    if (!newWishlistName.trim()) return;
  
    try {
      // Create the new wishlist
      const response = await axios.post("http://127.0.0.1:8005/api/wishlists/create", {
        name: newWishlistName,
        customer_id: localStorage.getItem("token"),
        wishlist_status: "active",
      });
  
      const newWishlist = response.data; // Get the new wishlist details
      setWishlists([...wishlists, newWishlist]); // Update the wishlist list
      setNewWishlistName(""); // Clear the input field
  
      // Automatically add the product to the new wishlist
      await axios.post("http://127.0.0.1:8005/api/wishlist_items/create", {
        wishlist_id: newWishlist.wishlist_id,
        product_id: id,
      });
  
      setSnackbarMessage("Wishlist created and product added successfully!");
      setSnackbarOpen(true);
  
      setWishlistDialogOpen(false); // Close the dialog
    } catch (error) {
      console.log(error)
      console.error("Error creating wishlist or adding product:", error.response?.data || error);
      setSnackbarMessage("Failed to create wishlist or add product.",error);
      setSnackbarOpen(true);
    }
  };
  


  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1)); // Prevent quantity from going below 1
  };
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
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
            <Box display="flex" alignItems="center" mb={1}>
              <Rating value={averageRating} precision={0.1} readOnly />
              <Typography variant="body1" ml={1}>
                ({averageRating.toFixed(1)})
              </Typography>
            </Box>
            <Typography variant="body1" gutterBottom>
              {product.description}
            </Typography>
            <Typography variant="body2" gutterBottom>
              {product.distributor}
            </Typography>
            <Box sx={{ mt: 2, mb: 1 }}>
              {product.discount_rate > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      textDecoration: 'line-through',
                      color: 'text.secondary',
                      fontSize: '0.9rem'
                    }}
                  >
                    {product.price.toFixed(2)} TL
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'error.main',
                      fontWeight: 'bold'
                    }}
                  >
                    %{product.discount_rate}
                  </Typography>
                </Box>
              )}
              <Typography
                variant="h6"
                sx={{
                  color: colors.primary,
                  fontWeight: 'bold'
                }}
              >
                {(product.price * (1 - product.discount_rate / 100)).toFixed(2)} TL
              </Typography>
            </Box>
            {/* Quantity Counter */}
            <Stack direction="row" alignItems="center" spacing={2} mt={2}>
              <IconButton onClick={decrementQuantity} sx = {{color: colors.blueAccent[400]}}>
                <Remove />
              </IconButton>
              <Typography variant="h6">{quantity}</Typography>
              <IconButton onClick={incrementQuantity} sx = {{color: colors.blueAccent[400]}}>
                <Add />
              </IconButton>
            </Stack>
            <Stack direction="row" spacing={2} mt={2}>
              <IconButton
              sx = {{color: colors.blueAccent[400]}}
              variant="contained"
              disabled={product.quantity <= 0} // Disable button if quantity is 0
              onClick={handleAddToCart}>
                <ShoppingCart color={colors.blueAccent[400]}/>
              </IconButton>
              <IconButton sx = {{color: colors.blueAccent[400]}}
                              variant="outlined"
                              onClick={handleAddToWishlist}>
                <FavoriteBorderIcon color={colors.blueAccent[400]}/>
              </IconButton>
              <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={1500}
                    onClose={handleCloseSnackbar}
                    message={snackbarMessage}
                  />
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs Section */}
      <Paper>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: colors.blueAccent[400], // İndikatörün rengi
            },
          }}
          textColor="primary.light"
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
                onClick={handleAddReview}
                sx = {{backgroundColor: colors.blueAccent[400], 
                  "&:hover": { // Hover durumunda yazı rengi
            transform: "scale(1.02)"}}}
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
                    key={review.review_id}
                    sx={{ padding: 2, marginBottom: 2 }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Rating value={review.rating} precision={0.1} readOnly />
                      <Typography variant="body1">
                        {review.comment}
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
      <Dialog
        open={wishlistDialogOpen}
        onClose={() => setWishlistDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Select or Create Wishlist</DialogTitle>
        <DialogContent>
          {/* List of Existing Wishlists */}
          <Typography variant="h6" gutterBottom>
            Your Wishlists
          </Typography>
          <List>
            {wishlists.map((wishlist) => (
              <ListItem
                button
                key={wishlist.wishlist_id}
                onClick={() => handleSelectWishlist(wishlist.wishlist_id)}
              >
                <ListItemText primary={wishlist.name || "Unnamed Wishlist"} />
              </ListItem>
            ))}
          </List>

          {/* Divider */}
          <Box mt={2} mb={2} textAlign="center">
            <Typography variant="body2" color="textSecondary">
              or
            </Typography>
          </Box>

          {/* Create New Wishlist Section */}
          <Typography variant="h6" gutterBottom>
            Create a New Wishlist
          </Typography>
          <Box component="form" onSubmit={(e) => e.preventDefault()} mt={2}>
            <TextField
              fullWidth
              variant="outlined"
              label="Wishlist Name"
              value={newWishlistName}
              onChange={(e) => setNewWishlistName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateWishlist}
              disabled={!newWishlistName.trim()} // Disable button if input is empty
            >
              Create Wishlist and Add Product
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWishlistDialogOpen(false)}>Cancel</Button>
        </DialogActions>
    </Dialog>

      <Snackbar
     open={snackbarOpen}
     autoHideDuration={1500}
     onClose={handleCloseSnackbar}
     message={snackbarMessage}
   />
    </Container>

    
  );
};

export default ProductDetailPage;

