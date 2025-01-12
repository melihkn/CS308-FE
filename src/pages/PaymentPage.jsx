/*
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Container,
  Paper,
} from '@mui/material';

function PaymentPage() {
  const location = useLocation();
  const { cartItems = [], userId = null } = location.state || {};
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [addressType, setAddressType] = useState('Home'); // Default type
  const [addressName, setAddressName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cvc, setCvc] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const navigate = useNavigate();

  // Helper function to get the token from localStorage
  const getToken = () => localStorage.getItem("token");

  const handlePayment = async () => {
    if (!cartItems.length) {
      alert("Cart is empty!");
      return;
    }

    

    const orderData = {
      customer_id: userId,
      total_price: totalPrice,
      order_date: new Date().toISOString().split('T')[0],
      order_address: deliveryAddress,
      order_address_type: addressType,
      order_address_name: addressName || null, // Optional field
      payment_status: "paid",
      invoice_link: null,
      order_status: 0,
      items: cartItems.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_purchase: item.price - (item.price * item.discount_rate / 100),
        real_price: item.price,
      })),
    };
    const totalPrice = cartItems.reduce((sum, item) => sum + item.quantity * (item.price_at_purchase * (1 - (item.discount_rate/100)) ), 0);

    try {
      const token = getToken();

      if (!token) {
        throw new Error("Authentication token is missing.");
      }

      const response = await fetch('http://127.0.0.1:8004/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Attach token to Authorization header
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Order creation failed');
      }

      const order = await response.json();
      alert("Payment successful and order created successfully!");
      navigate(`/invoice/${order.order_id}`);
      await clearShoppingCart();
      
    } catch (error) {
      console.error('Order creation failed:', error);
      alert(`Order creation failed: ${error.message}`);
    }
  };

  const clearShoppingCart = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8001/cart/clear?customer_id=${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to clear shopping cart');
      }
    } catch (error) {
      console.error('Failed to clear shopping cart:', error);
      alert(`Failed to clear shopping cart: ${error.message}`);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Payment Page
        </Typography>
        <List>
          {cartItems.map((item, index) => (
            <ListItem key={index} disableGutters>
              <ListItemText
                primary={`Product Name: ${item.name}, Model: ${item.model}`}
                secondary={`Quantity: ${item.quantity}, Price: $${item.price_at_purchase.toFixed(2)}`}
              />
            </ListItem>
          ))}
        </List>
        <Box component="form" sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Delivery Address"
            variant="outlined"
            fullWidth
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
          />
          <TextField
            label="Address Type (Home, Work, etc.)"
            variant="outlined"
            fullWidth
            value={addressType}
            onChange={(e) => setAddressType(e.target.value)}
          />
          <TextField
            label="Address Name (Optional)"
            variant="outlined"
            fullWidth
            value={addressName}
            onChange={(e) => setAddressName(e.target.value)}
          />
          <TextField
            label="Card Number"
            variant="outlined"
            fullWidth
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
          />
          <TextField
            label="CVC"
            variant="outlined"
            fullWidth
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Expiry Month"
              variant="outlined"
              fullWidth
              value={expiryMonth}
              onChange={(e) => setExpiryMonth(e.target.value)}
            />
            <TextField
              label="Expiry Year"
              variant="outlined"
              fullWidth
              value={expiryYear}
              onChange={(e) => setExpiryYear(e.target.value)}
            />
          </Box>
          <Button variant="contained" color="primary" onClick={handlePayment} fullWidth>
            Finish Payment
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default PaymentPage;

*/

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Container,
  Paper,
} from '@mui/material';

function PaymentPage() {
  const location = useLocation();
  const { cartItems = [], userId = null } = location.state || {};

  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [addressType, setAddressType] = useState('Home');
  const [addressName, setAddressName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cvc, setCvc] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');

  const navigate = useNavigate();

  // Helper function to get the token from localStorage
  const getToken = () => localStorage.getItem('token');

  const handlePayment = async () => {
    if (!cartItems.length) {
      alert('Cart is empty!');
      return;
    }

    // 1) Calculate total price first:
    const totalPrice = cartItems.reduce((sum, item) => {
      // Compute discounted price for a single unit
      const discountedPrice = item.price - item.price * (item.discount_rate / 100);
      return sum + discountedPrice * item.quantity;
    }, 0);

    // 2) Now build orderData (using that totalPrice):
    const orderData = {
      customer_id: userId,
      total_price: totalPrice,
      order_date: new Date().toISOString().split('T')[0],
      order_address: deliveryAddress,
      order_address_type: addressType,
      order_address_name: addressName || null, // Optional field
      payment_status: 'paid',
      invoice_link: null,
      order_status: 0,
      items: cartItems.map((item) => {
        // Same discount logic as above:
        const discountedPrice =
          item.price - item.price * (item.discount_rate / 100);
        return {
          product_id: item.product_id,
          quantity: item.quantity,
          price_at_purchase: discountedPrice,
          real_price: item.price,
        };
      }),
    };

    try {
      const token = getToken();
      if (!token) {
        throw new Error('Authentication token is missing.');
      }

      const response = await fetch('http://127.0.0.1:8004/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Attach token to Authorization header
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Order creation failed');
      }

      const order = await response.json();
      alert('Payment successful and order created successfully!');
      navigate(`/invoice/${order.order_id}`);
      await clearShoppingCart();
    } catch (error) {
      console.error('Order creation failed:', error);
      alert(`Order creation failed: ${error.message}`);
    }
  };

  // Clear the user's shopping cart
  const clearShoppingCart = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8001/cart/clear?customer_id=${userId}`,
        {
          method: 'DELETE',
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to clear shopping cart');
      }
    } catch (error) {
      console.error('Failed to clear shopping cart:', error);
      alert(`Failed to clear shopping cart: ${error.message}`);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Payment Page
        </Typography>
        <List>
          {cartItems.map((item, index) => {
            // Compute discounted price in the UI for display
            const discountedPrice =
              item.price - item.price * (item.discount_rate / 100);
            return (
              <ListItem key={index} disableGutters>
                <ListItemText
                  primary={`Product Name: ${item.name}, Model: ${item.model}`}
                  secondary={`Quantity: ${item.quantity}, Price: $${discountedPrice.toFixed(
                    2
                  )}`}
                />
              </ListItem>
            );
          })}
        </List>

        <Box component="form" sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Delivery Address"
            variant="outlined"
            fullWidth
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
          />
          <TextField
            label="Address Type (Home, Work, etc.)"
            variant="outlined"
            fullWidth
            value={addressType}
            onChange={(e) => setAddressType(e.target.value)}
          />
          <TextField
            label="Address Name (Optional)"
            variant="outlined"
            fullWidth
            value={addressName}
            onChange={(e) => setAddressName(e.target.value)}
          />
          <TextField
            label="Card Number"
            variant="outlined"
            fullWidth
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
          />
          <TextField
            label="CVC"
            variant="outlined"
            fullWidth
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Expiry Month"
              variant="outlined"
              fullWidth
              value={expiryMonth}
              onChange={(e) => setExpiryMonth(e.target.value)}
            />
            <TextField
              label="Expiry Year"
              variant="outlined"
              fullWidth
              value={expiryYear}
              onChange={(e) => setExpiryYear(e.target.value)}
            />
          </Box>
          <Button variant="contained" color="primary" onClick={handlePayment} fullWidth>
            Finish Payment
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default PaymentPage;
