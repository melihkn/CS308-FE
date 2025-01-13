import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Grid,
  Button,
} from '@mui/material';

// Icons
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const maskCardNumber = (cardNumber) => {
  if (!cardNumber) return '';
  const digitsOnly = cardNumber.replace(/\s+/g, '');
  const last4 = digitsOnly.slice(-4);
  return `**** **** **** ${last4}`;
};

const Review = ({
  address,
  addressType,
  cartItems,
  totalPrice,
  cardDetails,
  onBack,
  onPlaceOrder,
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Review &amp; Payment
      </Typography>
      <List>
        {cartItems.map((item, index) => {
          // 1) İndirim hesaplaması
          const discountRate = item.discount_rate || 0;
          const discountedPrice = item.price - item.price * (discountRate / 100);
          const lineTotal = discountedPrice * item.quantity;

          return (
            <ListItem key={index}>
              <ListItemText
                primary={`Product: ${item.name} ${
                  discountRate > 0 ? `(Discount: ${discountRate}%)` : ''
                }`}
                secondary={`Quantity: ${item.quantity}`}
              />
              {discountRate > 0 ? (
                <Box sx={{ textAlign: 'right' }}>
                  <Typography sx={{ textDecoration: 'line-through', color: 'gray' }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Typography>
                  <Typography>${lineTotal.toFixed(2)}</Typography>
                </Box>
              ) : (
                <Typography>${(item.price * item.quantity).toFixed(2)}</Typography>
              )}
            </ListItem>
          );
        })}
        <Divider />

        {/* Shipping */}
        <ListItem>
          <ListItemText primary="Shipping" secondary="Plus taxes" />
          <Typography>$9.99</Typography>
        </ListItem>

        {/* Total */}
        <ListItem>
          <ListItemText primary="Total" />
          <Typography>${(totalPrice + 9.99).toFixed(2)}</Typography>
        </ListItem>
      </List>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1" gutterBottom>
        Shipment details
      </Typography>
      <Typography>{address || 'No address provided'}</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {`Type: ${addressType}`}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1" gutterBottom>
        Payment details
      </Typography>
      <Grid container>
        <Grid item xs={6}>
          <Typography>Card Number:</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>
            {cardDetails.cardNumber
              ? maskCardNumber(cardDetails.cardNumber)
              : 'Not provided'}
          </Typography>
        </Grid>
      </Grid>

      {/* Buttons: Back (left arrow), Place Order (right arrow) */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          variant="outlined"
          sx={{
            backgroundColor: 'white',
            color: 'primary.main',
            border: '1px solid lightgray',
            ':hover': {
              backgroundColor: 'lightgray',
              color: 'primary.main',
            },
          }}
          onClick={onBack}
          startIcon={<ArrowBackIosNewIcon />} // Left arrow
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={onPlaceOrder}
          endIcon={<ArrowForwardIosIcon />} // Right arrow
        >
          Place Order
        </Button>
      </Box>
    </Box>
  );
};

export default Review;