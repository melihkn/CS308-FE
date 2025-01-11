import React, { useEffect, useState } from "react";
import { Button, Card, CardContent, CardMedia, Typography, Box, Rating } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { fetchAverageRating } from "./api";

const ProductCard = ({ userId, isLoggedIn, id, name, model, description, price, quantity, distributor, imageUrl, rating }) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [rating_, setRating] = useState(0); // State to store the rating

  useEffect(() => {
    // Fetch the rating when the component is mounted
    console.log("Average rating for product", id, "is", rating);
    const fetchRating = async () => {
      const avgRating = await fetchAverageRating(id); // Fetch the average rating for this product
      setRating(avgRating); // Update the state with the fetched rating
    };
    fetchRating();
  }, [id]); // Re-run the effect if `id` changes

  const handleCardClick = () => {
    navigate(`/product-detail/${id}`);
  };

  const addToCart = async (product_id) => {
    if (userId) {
      try {
        await axios.post(
          "http://127.0.0.1:8001/cart/add",
          { product_id, quantity: 1 },
          { params: { customer_id: userId } }
        );
        console.log("Item added to backend cart.");
      } catch (error) {
        console.error("Error adding item to backend cart:", error);
      }
    } else {
      let cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existingItemIndex = cart.findIndex(item => item.product_id.trim() === String(product_id).trim());
      if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1;
      } else {
        cart.push({ product_id: String(id), quantity: 1 });
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      setCartItems(cart);
    }
  };

  const handleAddToCart = () => {
    addToCart(id);
    console.log(`${name} added to cart.`);
  };

  return (
    <Card
      sx={{
        maxWidth: 345,
        margin: 2,
        transition: "transform 0.3s ease-in-out",
        cursor: "pointer",
        "&:hover": {
          transform: "scale(1.05)"
        }
      }}
      onClick={handleCardClick}
    >
      <CardMedia
        component="img"
        alt={name}
        height="140"
        image={imageUrl}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Model:</strong> {model}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Quantity:</strong> {quantity}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Price:</strong> {price}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Distributor:</strong> {distributor}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 2,
          }}
        >
          <Rating
            name="read-only-rating"
            value={rating} // Use the resolved rating value
            precision={0.5}
            readOnly
            sx={{ marginRight: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            disabled={quantity <= 0}
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
          >
            Add to Cart
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
