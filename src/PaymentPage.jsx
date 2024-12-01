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
  const [cardNumber, setCardNumber] = useState('');
  const [cvc, setCvc] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const navigate = useNavigate();

  const handlePayment = async () => {
    if (!cartItems.length) {
      alert("Cart is empty!");
      return;
    }

    const totalPrice = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

    const orderData = {
      customer_id: userId,
      total_price: totalPrice,
      order_date: new Date().toISOString().split('T')[0],
      payment_status: "paid",
      invoice_link: null,
      order_status: 0,
      items: cartItems.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_purchase: item.price,
      }))
    };

    try {
      const response = await fetch('http://127.0.0.1:8004/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Order creation failed');
      }

      const order = await response.json();
      alert("Payment successful and order created successfully!");

      await clearShoppingCart();
      navigate('/orders');
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
                secondary={`Quantity: ${item.quantity}, Price: $${item.price.toFixed(2)}`}
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
