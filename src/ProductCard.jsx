// ProductCard.js
import React from "react";
import { Button, Card, CardContent, CardMedia, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

const ProductCard = ({ userId, isLoggedIn, id, name, model, description, quantity, distributor, imageUrl }) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = React.useState([]);

  const handleCardClick = () => {
    navigate(`/product-detail/${id}`);
  };

  const addToCart = async (product_id) => {
    console.log("User login: ", isLoggedIn, "User ID: ", userId);
    // If the user is logged in, add the item to the backend cart
    if (userId) {
      try {
        // Send a POST request to the server to add the item to the cart
        await axios.post(
          "http://127.0.0.1:8001/cart/add",
          {
            product_id: product_id,
            quantity: 1,
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
      let cart = JSON.parse(localStorage.getItem("cart") || "[]");
      console.log("Cart:", cart); // Debugging
      // Find the index of the existing item in the cart
      const existingItemIndex = cart.findIndex(
        item => item.product_id.trim() === String(product_id).trim()
      );
      console.log("Existing item index:", existingItemIndex); // Debugging
      // If the item exists in the cart, increase the quantity
      if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1;
      }
      // If the item does not exist in the cart, add a new item 
      else {
        cart.push({ product_id: String(id), quantity: Number(1) });
      }
      // Save the updated cart to the session storage
      localStorage.setItem("cart", JSON.stringify(cart));
      // Update the cart items state with the updated cart
      setCartItems(cart);
    }
  };

  const handleAddToCart = () => {
    // Add logic for adding product to the cart
    addToCart(id)
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
        objectFit="contain"
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
          <strong>Distributor:</strong> {distributor}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          disabled={quantity <= 0} // Disable button if quantity is 0
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the card click event
            handleAddToCart();
          }}
        >
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
