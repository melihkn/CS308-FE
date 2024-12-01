import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Grid, Button } from "@mui/material";
import ShoppingProductCard from "./ShoppingProductCard";

const BACKEND_URL = "http://127.0.0.1:8001";

function ShoppingCart({ isLoggedIn, userId }) {
  const [basicCart, setBasicCart] = useState([]);
  const [detailedCart, setDetailedCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

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
    const mergeLocalCartWithBackend = async () => {
      if (isLoggedIn && userId) {
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        if (localCart.length > 0) {
          try {
            await axios.post(`${BACKEND_URL}/cart/merge`, {
              items: localCart,
              customer_id: userId,
            });
            localStorage.removeItem("cart");
            const response = await axios.get(`${BACKEND_URL}/cart/${userId}`);
            setBasicCart(response.data.cart);
          } catch (error) {
            console.error("Error merging local cart with backend:", error);
          }
        }
      }
    };

    mergeLocalCartWithBackend();
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
      const total = detailedCart.reduce(
        (sum, item) => sum + (item.quantity * item.price || 0),
        0
      );
      setTotalPrice(total);
    };
    calculateTotal();
  }, [detailedCart]);

  const adjustQuantity = async (productId, delta) => {
    const updatedItems = basicCart
      .map((item) =>
        item.product_id === productId
          ? { ...item, quantity: item.quantity + delta }
          : item
      )
      .filter((item) => item.quantity > 0);

    setBasicCart(updatedItems);

    if (isLoggedIn && userId) {
      const endpoint = delta > 0 ? "increase_quantity" : "decrease_quantity";
      try {
        await axios.patch(`${BACKEND_URL}/cart/${endpoint}`, {
          product_id: productId,
          customer_id: userId,
        });
      } catch (error) {
        console.error(
          `Error ${delta > 0 ? "increasing" : "decreasing"} item quantity in backend:`,
          error
        );
      }
    } else {
      localStorage.setItem("cart", JSON.stringify(updatedItems));
    }
  };

  const removeFromCart = async (productId) => {
    const updatedItems = basicCart.filter((item) => item.product_id !== productId);
    setBasicCart(updatedItems);

    if (isLoggedIn && userId) {
      try {
        await axios.delete(`${BACKEND_URL}/cart/remove`, {
          data: { product_id: productId, customer_id: userId },
        });
      } catch (error) {
        console.error("Error removing item from cart in backend:", error);
      }
    } else {
      localStorage.setItem("cart", JSON.stringify(updatedItems));
    }
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        {detailedCart.length > 0 ? "Shopping Cart" : "Shopping Cart is empty"}
      </Typography>

      <Grid container spacing={3}>
        {detailedCart.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.product_id}>
            <ShoppingProductCard
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
          </Grid>
        ))}
      </Grid>

      {detailedCart.length > 0 && (
        <Box sx={{ mt: 4, textAlign: "right" }}>
          <Typography variant="h5">Total Price: ${totalPrice.toFixed(2)}</Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => alert("Redirect to checkout")}
          >
            Proceed to Checkout
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default ShoppingCart;
