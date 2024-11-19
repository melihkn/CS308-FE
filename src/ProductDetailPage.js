import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
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
import { fetchProductbyId } from "./api";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0); // For tabs
  const [reviews, setReviews] = useState([]); // Reviews
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchProductbyId(id);
        setProduct(data);
        setReviews(data.reviews || []); // Assuming reviews are part of the product data
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

    const newReview = {
      productId: id,
      rating,
      comment,
      user: "Anonymous", // Replace with logged-in user's info if available
    };

    /*try {
      const addedReview = await addReview(newReview); // Send review to backend
      setReviews([addedReview, ...reviews]); // Update reviews
      setRating(0); // Reset rating
      setComment(""); // Reset comment
    } catch (error) {
      console.error("Error adding review:", error.response?.data || error);
      alert("Failed to add review. Please try again.");
    }*/
  };

  const handleAddToCart = async () => {
    /*try {
      await addToCart({ productId: id });
      alert("Product added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error.response?.data || error);
      alert("Failed to add product to cart.");
    }*/
  };

  const handleAddToWishlist = async () => {
    /*try {
      await addToWishlist({ productId: id });
      alert("Product added to wishlist!");
    } catch (error) {
      console.error("Error adding to wishlist:", error.response?.data || error);
      alert("Failed to add product to wishlist.");
    }*/
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
              {product.price.toLocaleString("tr-TR")} TL
            </Typography>
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
