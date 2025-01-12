/*
  ShoppingCart component displays the items in the shopping cart.
  If the user is logged in, it saves the items to the backend cart.
  If the user is not logged in, it saves the items to the session storage cart temporarily.
    - key is cart and value is an array (actually a dictionary -> item and count) of objects with productId and quantity properties.


  Props:
    - isLoggedIn: boolean to check if the user is logged in or not
    - userId: user id of the logged-in user (coming from the backend endpoint called /auth/status)

  State:
    - cartItems: array of objects with productId and quantity properties

  Functions:
    - addToCart: function to add an item to the cart
      - If the user is logged in, add the item to the backend cart
      - If the user is not logged in, add the item to the session storage cart

  Side Effects:
    - Load the items from the session storage cart when the component mounts

  In jsx code:
    - Display the items in the cart
    - Display a button to add an example product to the cart
    - Display a message to inform the user about the cart saving method
*/

/*
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ShoppingProductCard from './ShoppingProductCard';
import './ShoppingCart.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const BACKEND_URL = 'http://127.0.0.1:8001';

function ShoppingCart({ isLoggedIn, userId }) {
  const [basicCart, setBasicCart] = useState([]);
  const [detailedCart, setDetailedCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchBasicCart = async () => {
      if (isLoggedIn && userId) {
        try {
          console.log("UserID: ", userId)
          const response = await axios.get(`${BACKEND_URL}/cart/${userId}`);
          setBasicCart(response.data.cart);
        } catch (error) {
          console.error("Error fetching cart from backend:", error);
        }
      } else {
        const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
        console.log("Stored Cart:", storedCart)
        setBasicCart(storedCart);
      }
    };

    fetchBasicCart();
  }, [isLoggedIn, userId]);


  useEffect(() => {
    const fetchDetailedCart = async () => {
      try {
        const detailedItems = await Promise.all(
          basicCart.map(async (item) => {
            const response = await axios.get(`${BACKEND_URL}/products/${item.product_id}`);
            return { ...response.data, quantity: item.quantity };
          })
        );
        setDetailedCart(detailedItems);
      } catch (error) {
        console.error("Error fetching detailed product info:", error);
      }
    };

    if (basicCart.length > 0) {
      fetchDetailedCart();
    }
  }, [basicCart]);

  useEffect(() => {
    const calculateTotal = () => {
      const total = detailedCart.reduce((sum, item) => sum + (item.quantity * item.price || 0), 0);
      setTotalPrice(total);
    };
    calculateTotal();
  }, [detailedCart]);

  const adjustQuantity = async (productId, delta) => {
    const updatedItems = basicCart.map(item =>
      item.product_id === productId ? { ...item, quantity: item.quantity + delta } : item
    ).filter(item => item.quantity > 0);

    setBasicCart(updatedItems);
    if (updatedItems.filter(item => item.product_id === productId).length === 0) {
      removeFromCart(productId);
      return;
    }

    if (isLoggedIn && userId) {
      const endpoint = delta > 0 ? "increase_quantity" : "decrease_quantity";
      // if quantity of a product with id of product id comes to 0, remove the item from the cart
      

      try {
        await axios.patch(`${BACKEND_URL}/cart/${endpoint}`, {
          product_id: productId,
          customer_id: userId,
        });
      } catch (error) {
        console.error(`Error ${delta > 0 ? "increasing" : "decreasing"} item quantity in backend:`, error);
      }
    } else {
      localStorage.setItem("cart", JSON.stringify(updatedItems));
    }
  };

  const removeFromCart = async (productId) => {
    const updatedItems = basicCart.filter(item => item.product_id !== productId);
    setBasicCart(updatedItems);

    if (isLoggedIn && userId) {
      try {
        await axios.delete(`${BACKEND_URL}/cart/remove`, {
          data: { product_id: productId, customer_id: userId },
        
        });
        setBasicCart(updatedItems);
        setDetailedCart(detailedCart.filter(item => item.product_id !== productId));
      } catch (error) {
        console.error("Error removing item from cart in backend:", error);
      }
    } else {
      localStorage.setItem("cart", JSON.stringify(updatedItems));
      setBasicCart(updatedItems);
      setDetailedCart(detailedCart.filter(item => item.product_id !== productId));
    }
  };

  const navigateToPayment = () => {
    if (!userId) { // Check if userId is null or undefined
      alert("You must be logged in to proceed to payment!");
      return;
    }
    navigate('/payment', { state: { cartItems: detailedCart, userId } });
    console.log(detailedCart);
    console.log(userId);
  };
  

  

  return (
    <div className="shopping-cart-container">
      <h2>{detailedCart.length > 0 ? "Shopping Cart" : "Shopping Cart is empty"}</h2>

      <div className="cart-items">
        {detailedCart.map(item => (
          <ShoppingProductCard
            key={item.product_id}
            name={item.name}
            model={item.model}
            description={item.description}
            quantity={item.quantity}
            distributor={item.distributor}
            imageUrl={item.image_url}
            price={item.price}
            onIncrease={() => adjustQuantity(item.product_id, 1)}
            onDecrease={() => adjustQuantity(item.product_id, -1)}
            onRemove={() => removeFromCart(item.product_id)}
          />
        ))}
      </div>
      <div className="cart-summary">
        <h3>Total Price: ${totalPrice.toFixed(2)}</h3>

        <button onClick={navigateToPayment}>Proceed to Checkout</button>
      </div>
    </div>
  );
}

*/

import React, { useEffect, useState } from "react";
import axios from "axios";
import ShoppingProductCard from "../components/ShoppingProductCard";
import { Box, Typography, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = "http://127.0.0.1:8001";

function ShoppingCart({ isLoggedIn, userId }) {
  const [basicCart, setBasicCart] = useState([]);
  const [detailedCart, setDetailedCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBasicCart = async () => {
      if (isLoggedIn && userId) {
        try {
          const response = await axios.get(`${BACKEND_URL}/cart/${userId}`);
          setBasicCart(response.data.cart);
        } catch (error) {
          console.error("Error fetching cart from backend:", error);
        }
      } else {
        const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setBasicCart(storedCart);
      }
    };

    fetchBasicCart();
  }, [isLoggedIn, userId]);

  useEffect(() => {
    const fetchDetailedCart = async () => {
      try {
        
        const detailedItems = await Promise.all(
          basicCart.map(async (item) => {
            //localStorage.clear()
            console.log(item,localStorage);
            const response = await axios.get(`${BACKEND_URL}/products/${item.product_id}`);
            return { ...response.data, quantity: item.quantity };
          })
        );
        setDetailedCart(detailedItems);
      } catch (error) {
        console.error("Error fetching detailed product info:", error);
      }
    };

    if (basicCart.length > 0) {
      fetchDetailedCart();
    }
  }, [basicCart]);

  useEffect(() => {
    const calculateTotal = () => {
      const total = detailedCart.reduce((sum, item) => {
        const discount = item.discount_rate ? (item.price * item.discount_rate) / 100 : 0;
        const discountedPrice = item.price - discount;
        return sum + item.quantity * discountedPrice;
      }, 0);
      setTotalPrice(total);
    };
    calculateTotal();
  }, [detailedCart]);

  const adjustQuantity = async (productId, delta) => {
    const updatedItems = basicCart.map(item =>
      item.product_id === productId ? { ...item, quantity: item.quantity + delta } : item
    ).filter(item => item.quantity > 0);

    setBasicCart(updatedItems);
    if (updatedItems.filter(item => item.product_id === productId).length === 0) {
      removeFromCart(productId);
      return;
    }

    if (isLoggedIn && userId) {
      const endpoint = delta > 0 ? "increase_quantity" : "decrease_quantity";
      // if quantity of a product with id of product id comes to 0, remove the item from the cart
      

      try {
        await axios.patch(`${BACKEND_URL}/cart/${endpoint}`, {
          product_id: productId,
          customer_id: userId,
        });
      } catch (error) {
        console.error(`Error ${delta > 0 ? "increasing" : "decreasing"} item quantity in backend:`, error);
      }
    } else {
      localStorage.setItem("cart", JSON.stringify(updatedItems));
    }
  };

  const removeFromCart = async (productId) => {
    const updatedItems = basicCart.filter(item => item.product_id !== productId);
    setBasicCart(updatedItems);

    if (isLoggedIn && userId) {
      try {
        await axios.delete(`${BACKEND_URL}/cart/remove`, {
          data: { product_id: productId, customer_id: userId },
        
        });
        setBasicCart(updatedItems);
        setDetailedCart(detailedCart.filter(item => item.product_id !== productId));
      } catch (error) {
        console.error("Error removing item from cart in backend:", error);
      }
    } else {
      localStorage.setItem("cart", JSON.stringify(updatedItems));
      setBasicCart(updatedItems);
      setDetailedCart(detailedCart.filter(item => item.product_id !== productId));
    }
  };

  const navigateToPayment = () => {
    if (!userId) {
      alert("You must be logged in to proceed to payment!");
      return;
    }
    navigate("/payment", { state: { cartItems: detailedCart, userId } });
  };

  return (
    <Box
      sx={{
        padding: "16px",
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      <Typography variant="h4" gutterBottom>
        {detailedCart.length > 0 ? "Shopping Cart" : "Shopping Cart is empty"}
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {detailedCart.map((item) => (
          <ShoppingProductCard
            key={item.product_id}
            name={item.name}
            model={item.model}
            description={item.description}
            quantity={item.quantity}
            distributor={item.distributor}
            imageUrl={item.image_url}
            discountRate={item.discount_rate}
            price={item.price}
            onIncrease={() => adjustQuantity(item.product_id, 1)}
            onDecrease={() => adjustQuantity(item.product_id, -1)}
            onRemove={() => removeFromCart(item.product_id)}
          />
        ))}
      </Box>

      <Box sx={{ marginTop: "16px", textAlign: "right" }}>
        <Typography variant="h5">Total Price: ${totalPrice.toFixed(2)}</Typography>
        <Button
          variant="contained"
          sx={{
            marginTop: "8px",
            backgroundColor: theme.palette.success.main,
            color: theme.palette.getContrastText(theme.palette.success.main),
            "&:hover": { backgroundColor: theme.palette.success.dark },
          }}
          onClick={navigateToPayment}
        >
          Proceed to Checkout
        </Button>
      </Box>
    </Box>
  );
}

export default ShoppingCart;
