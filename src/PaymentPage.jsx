import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  // State'ler
  const [cartItems] = useState([
    { name: 'Laptop', model: 'X1', quantity: 1, price: 1500 },
    { name: 'Mouse', model: 'MX', quantity: 2, price: 50 },
  ]);
  const [deliveryAddress] = useState('1 MUI Drive, Reactville, Anytown, 99999, USA');
  const [paymentDetails] = useState({
    cardType: 'Visa',
    cardHolder: 'Mr. John Smith',
    cardNumber: 'xxxx-xxxx-xxxx-1234',
    expiryDate: '04/2024',
  });

  const totalPrice = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const handlePayment = () => {
    alert('Payment Successful!');
    navigate('/orders');
  };

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
                  primary={`Product: ${item.name} (${item.model})`}
                  secondary={`Quantity: ${item.quantity}`}
                />
                <Typography variant="body2">${(item.price * item.quantity).toFixed(2)}</Typography>
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
              <Typography gutterBottom>John Smith</Typography>
              <Typography gutterBottom sx={{ color: 'text.secondary' }}>
                {deliveryAddress}
              </Typography>
            </div>
            <div>
              <Typography variant="subtitle2" gutterBottom>
                Payment details
              </Typography>
              <Grid container>
                {Object.entries(paymentDetails).map(([key, value]) => (
                  <Stack
                    key={key}
                    direction="row"
                    spacing={1}
                    useFlexGap
                    sx={{ width: '100%', mb: 1 }}
                  >
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                      {key.replace(/([A-Z])/g, ' $1')}:
                    </Typography>
                    <Typography variant="body2">{value}</Typography>
                  </Stack>
                ))}
              </Grid>
            </div>
          </Stack>
        </Stack>

        {/* Ödeme Detayları */}
        <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="subtitle2">Credit Card Details</Typography>
            <CreditCardRoundedIcon sx={{ color: 'text.secondary' }} />
          </Box>

          <FormControl fullWidth>
            <FormLabel htmlFor="card-number">Card Number</FormLabel>
            <OutlinedInput
              id="card-number"
              autoComplete="card-number"
              placeholder="0000 0000 0000 0000"
              required
              size="small"
            />
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth>
              <FormLabel htmlFor="cvv">CVV</FormLabel>
              <OutlinedInput
                id="cvv"
                autoComplete="cvv"
                placeholder="123"
                required
                size="small"
              />
            </FormControl>

            <FormControl fullWidth>
              <FormLabel htmlFor="expiration-date">Expiration Date</FormLabel>
              <OutlinedInput
                id="expiration-date"
                autoComplete="expiration-date"
                placeholder="MM/YY"
                required
                size="small"
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