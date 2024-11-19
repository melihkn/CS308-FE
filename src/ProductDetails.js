import React from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Button, TextField } from "@mui/material";

const ProductDetails = () => {
  const { id } = useParams();

  // You can fetch product details from an API or use context/state
  const product = {
    id,
    name: "Sample Product",
    price: "$123",
    reviews: [
      { user: "John", comment: "Great product!" },
      { user: "Jane", comment: "Good value for money." }
    ]
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        {product.name}
      </Typography>
      <Typography variant="h6" component="h2">
        Price: {product.price}
      </Typography>
      <Typography variant="h6" component="h2" gutterBottom>
        Reviews:
      </Typography>
      {product.reviews.map((review, index) => (
        <Typography key={index} variant="body1">
          <strong>{review.user}:</strong> {review.comment}
        </Typography>
      ))}
      <TextField
        label="Write a review"
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary">
        Submit Review
      </Button>
    </Container>
  );
};

export default ProductDetails;
