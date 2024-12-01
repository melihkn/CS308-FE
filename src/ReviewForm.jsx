import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Rating,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { createReview, updateReview } from "./api"; // API calls for reviews

const ReviewForm = ({ review = {}, onClose }) => {
  const [productId, setProductId] = useState("");
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const [approvalStatus, setApprovalStatus] = useState("");

  useEffect(() => {
    setProductId(review.product_id || "");
    setRating(review.rating || 1);
    setComment(review.comment || "");
    setApprovalStatus(review.approval_status || "");
  }, [review]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const reviewData = {
      product_id: productId,
      rating: parseInt(rating, 10),
      ...(comment && { comment }),
      ...(approvalStatus && { approval_status: approvalStatus }),
    };

    try {
      if (review.review_id) {
        await updateReview(review.review_id, reviewData);
        alert("Review Updated Successfully");
      } else {
        await createReview(reviewData);
        alert("Review Created Successfully");
      }
      onClose();
    } catch (error) {
      console.error("Error saving review:", error);
      alert("Failed to save review. Please try again.");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        maxWidth: 500,
        margin: "0 auto",
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "#fff",
      }}
    >
      <Typography variant="h5" textAlign="center">
        {review.review_id ? "Update Review" : "Create Review"}
      </Typography>

      {/* Product ID Input */}
      <TextField
        label="Product ID"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
        required
        fullWidth
      />

      {/* Rating Input */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="body1">Rating:</Typography>
        <Rating
          name="rating"
          value={rating}
          onChange={(e, newValue) => setRating(newValue)}
          size="large"
          max={5}
          precision={1}
        />
      </Box>

      {/* Comment Input */}
      <TextField
        label="Comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        multiline
        rows={3}
        fullWidth
      />

      {/* Approval Status Input */}
      <FormControl fullWidth>
        <InputLabel>Approval Status</InputLabel>
        <Select
          value={approvalStatus}
          onChange={(e) => setApprovalStatus(e.target.value)}
        >
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Approved">Approved</MenuItem>
          <MenuItem value="Rejected">Rejected</MenuItem>
        </Select>
      </FormControl>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
      >
        {review.review_id ? "Update Review" : "Create Review"}
      </Button>

      {/* Cancel Button */}
      <Button
        variant="outlined"
        color="secondary"
        fullWidth
        onClick={onClose}
        sx={{ mt: 1 }}
      >
        Cancel
      </Button>
    </Box>
  );
};

export default ReviewForm;
