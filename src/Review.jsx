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
        Review & Payment
      </Typography>
      <List>
        {cartItems.map((item, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={`Product: ${item.name}`}
              secondary={`Quantity: ${item.quantity}`}
            />
            <Typography>${(item.quantity * item.price).toFixed(2)}</Typography>
          </ListItem>
        ))}
        <Divider />
        <ListItem>
          <ListItemText primary="Shipping" secondary="Plus taxes" />
          <Typography>$9.99</Typography>
        </ListItem>
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
          <Typography>{cardDetails.cardNumber || 'Not provided'}</Typography>
        </Grid>
      </Grid>
      {/* Butonlar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button variant="outlined" onClick={onBack}>
          Back
        </Button>
        <Button variant="contained" color="primary" onClick={onPlaceOrder}>
          Place Order
        </Button>
      </Box>
    </Box>
  );
};

export default Review;