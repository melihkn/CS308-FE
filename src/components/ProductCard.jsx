import React, { useEffect, useState } from "react";
import { Button, Card, CardContent, CardMedia, Typography, Box, Rating, IconButton, Chip } from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { fetchAverageRating } from "../api/api";
import {useTheme} from "@mui/material";
import { tokens } from "../theme";

const ProductCard = ({ userId, isLoggedIn, id, name, model, price, description, quantity, distributor, imageUrl, discountRate, rating }) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [rating_, setRating] = useState(0);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const fetchRating = async () => {
      const avgRating = await fetchAverageRating(id);
      setRating(avgRating);
    };
    fetchRating();
  }, [id]);

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

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent card click when adding to cart
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
      <Box sx={{ position: 'relative' }}>
        {quantity <= 0 && (
          <Chip
            label="Out of Stock"
            color="error"
            size="small"
            sx={{ position: 'absolute', top: 8, left: 8, zIndex: 1 }}
          />
        )}
        {quantity > 0 && quantity <= 5 && (
          <Chip
            label="Low Stock"
            color="warning"
            size="small"
            sx={{ position: 'absolute', top: 8, left: 8, zIndex: 1 }}
          />
        )}
        {discountRate > 0 && (
          <Chip
            label={`-${discountRate}%`}
            color="error"
            size="small"
            sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
          />
        )}
        <CardMedia
          component="img"
          alt={name}
          height="250"
          image={imageUrl}
        />
      </Box>
      <CardContent  sx={{ height: 220, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
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
          <strong>Distributor:</strong> {distributor}
        </Typography>
        
        {/* Price Display Section */}
        <Box sx={{ mt: 2, mb: 1 }}>
          {discountRate > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                variant="body1"
                sx={{
                  textDecoration: 'line-through',
                  color: 'text.secondary',
                  fontSize: '0.9rem'
                }}
              >
                {price.toFixed(2)} TL
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'error.main',
                  fontWeight: 'bold'
                }}
              >
                %{discountRate}
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
            {(price * (1 - discountRate / 100)).toFixed(2)} TL
          </Typography>
        </Box>

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
            value={rating}
            precision={0.5}
            readOnly
            sx={{ marginRight: 2 }}
          />

          <IconButton
            disabled={quantity <= 0}
            onClick={handleAddToCart}
          >
            <ShoppingCart />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
