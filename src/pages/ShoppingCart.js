import React, { useEffect, useState } from "react";
import axios from "axios";
import ShoppingProductCard from "../components/ShoppingProductCard";
import { Box,
  Typography, 
  Button ,
  Alert,
  Snackbar
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = "http://127.0.0.1:8001";

function ShoppingCart({ isLoggedIn, userId }) {
  const [basicCart, setBasicCart] = useState([]);
  const [detailedCart, setDetailedCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const theme = useTheme();
  const navigate = useNavigate();

  //snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

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
      setSnackbar({ open: true, message: 'Please login to proceed to payment!', severity: 'error' });
      return;
    }
    // we check total price to be greater than 0, otherwise we alert the user using snackbar that the cart is empty and cannot proceed to payment
    else if (totalPrice <= 0) {
      setSnackbar({ open: true, message: 'Cart is empty, cannot proceed to payment!', severity: 'error' });
      return;
    }
    navigate("/payment");
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
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

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          message="Cart is empty, cannot proceed to payment!"
        >
          <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
        </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}

export default ShoppingCart;
