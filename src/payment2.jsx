import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
  OutlinedInput,
  FormControl,
  FormLabel,
  Divider,
  Stack,
  List,
  ListItem,
  ListItemText,
  Grid,
} from '@mui/material';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';

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
      alert('Cart is empty!');
      return;
    }

    const totalPrice = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

    const orderData = {
      customer_id: userId,
      total_price: totalPrice,
      order_date: new Date().toISOString().split('T')[0],
      payment_status: 'paid',
      invoice_link: null,
      order_status: 0,
      items: cartItems.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_purchase: item.price,
      })),
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

      alert('Payment successful and order created successfully!');
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

  const totalPrice = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Review & Payment
        </Typography>

        {/* Review Bölümü */}
        <Stack spacing={2}>
          <List disablePadding>
            {cartItems.map((item, index) => (
              <ListItem key={index} sx={{ py: 1, px: 0 }}>
                <ListItemText
                  primary={`Product: ${item.name}`}
                  secondary={`Quantity: ${item.quantity}`}
                />
                <Typography variant="body2">
                  ${(item.price * item.quantity).toFixed(2)}
                </Typography>
              </ListItem>
            ))}
            <ListItem sx={{ py: 1, px: 0 }}>
              <ListItemText primary="Shipping" secondary="Plus taxes" />
              <Typography variant="body2">$9.99</Typography>
            </ListItem>
            <ListItem sx={{ py: 1, px: 0 }}>
              <ListItemText primary="Total" />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                ${(totalPrice + 9.99).toFixed(2)}
              </Typography>
            </ListItem>
          </List>
          <Divider />
          <Stack direction="column" divider={<Divider flexItem />} spacing={2} sx={{ my: 2 }}>
            <div>
              <Typography variant="subtitle2" gutterBottom>
                Shipment details
              </Typography>
              <Typography gutterBottom>{deliveryAddress || 'No address provided'}</Typography>
            </div>
          </Stack>
        </Stack>

        {/* Payment Bölümü */}
        <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="subtitle2">Credit Card Details</Typography>
            <CreditCardRoundedIcon sx={{ color: 'text.secondary' }} />
          </Box>

          <FormControl fullWidth>
            <FormLabel htmlFor="card-number">Card Number</FormLabel>
            <OutlinedInput
              id="card-number"
              placeholder="0000 0000 0000 0000"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth>
              <FormLabel htmlFor="cvv">CVV</FormLabel>
              <OutlinedInput
                id="cvv"
                placeholder="123"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
              />
            </FormControl>

            <FormControl fullWidth>
              <FormLabel htmlFor="expiration-date">Expiration Date</FormLabel>
              <OutlinedInput
                id="expiration-date"
                placeholder="MM/YY"
                value={`${expiryMonth}/${expiryYear}`}
                onChange={(e) => {
                  const [month, year] = e.target.value.split('/');
                  setExpiryMonth(month);
                  setExpiryYear(year);
                }}
              />
            </FormControl>
          </Box>
        </Box>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          onClick={handlePayment}
        >
          Pay Now
        </Button>
      </Paper>
    </Container>
  );
}

export default PaymentPage;