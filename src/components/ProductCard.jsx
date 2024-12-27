// ProductCard.js
/*
    ProductCard component is a reusable component that displays information about a product.
    It takes the following props:
        - name: name of the product
        - model: model of the product
        - description: description of the product
        - quantity: quantity of the product
        - distributor: distributor of the product
        - imageUrl: URL of the product image

    Example usage:
    <ProductCard 
        name="Dog Food"
        model="1234"
        description="A healthy dog food for your furry friend."
        quantity={10}
        distributor="PetCo"
        imageUrl="https://example.com/dog-food.jpg"
    />

    These info will be coming from the endpoint in the backend called /products which returns a list of products as json format.
    Each product in the list is a dictionary object with the following keys: 
        - product_id, name, model, description, quantity, distributor, image_url
        - image_url is the URL of the product image on the server 

*/

import React, { useEffect, useState } from "react";
import { Button, Card, CardContent, CardMedia, Typography, Box, Rating, IconButton } from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { fetchAverageRating } from "../api/api";

const ProductCard = ({ userId, isLoggedIn, id, name, model, price, description, quantity, distributor, imageUrl, discountRate }) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [rating, setRating] = useState(0); // State to store the rating

  useEffect(() => {
    // Fetch the rating when the component is mounted
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
          <strong>Description:</strong> {description}
        </Typography>
        {quantity === 0 ? (
          <Typography variant="body2" color="error.main">
            No Stock
          </Typography>
        ) : quantity < 10 ? (
          <Typography variant="body2" color="error.main">
            Last Products
          </Typography>
        ) : null}
        <Typography variant="body2" color="text.secondary">
          <strong>Distributor:</strong> {distributor}
        </Typography>
        {/* Add price display */}
        <Box sx={{ mt: 2, mb: 1 }}>
          {discountRate > 0 ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                variant="body1"
                sx={{
                  textDecoration: 'line-through',
                  color: 'text.secondary',
                  fontSize: '0.9rem'
                }}
              >
                {price.toFixed(2)} $
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
          ) : null}
          <Typography
            variant="h6"
            sx={{
              color: 'primary.main',
              fontWeight: 'bold'
            }}
          >
            {(price * (1 - discountRate / 100)).toFixed(2)} $
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
            value={rating} // Use the resolved rating value
            precision={0.5}
            readOnly
            sx={{ marginRight: 2 }}
          />

          <IconButton
            disabled={quantity <= 0}
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
          >
             <ShoppingCart />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
