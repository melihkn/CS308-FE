import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';

const OrderSummary = ({ cartItems, totalPrice }) => {
  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        backgroundColor: '#1f2937', // Dark gray
        color: '#e2e8f0',           // Light gray text
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 'bold',
          mb: 2,
          textAlign: 'center',
          borderBottom: '2px solid #3b82f6', // Blue accent line
          pb: 1,
        }}
      >
        Order Summary
      </Typography>

      <List disablePadding>
        {cartItems.map((item, index) => (
          <ListItem
            key={index}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              py: 1,
              px: 0,
            }}
          >
            {/* Product Name */}
            <Typography sx={{ color: '#93c5fd', fontWeight: 500 }}>
              {item.name}
            </Typography>

            {/* Quantity */}
            <Typography sx={{ color: '#a5b4fc' }}>
              {`Quantity: ${item.quantity}`}
            </Typography>

            {/* Price */}
            <Typography sx={{ color: '#a5b4fc' }}>
              {`Price: $${item.price.toFixed(2)}`}
            </Typography>
          </ListItem>
        ))}

        <Divider sx={{ my: 2, borderColor: '#3b82f6' }} />

        {/* Shipping */}
        <ListItem sx={{ py: 0, px: 0 }}>
          <ListItemText
            primary={
              <Typography sx={{ color: '#93c5fd' }}>
                Shipping
              </Typography>
            }
          />
          <Typography sx={{ fontWeight: 'bold', color: '#93c5fd' }}>
            $9.99
          </Typography>
        </ListItem>

        {/* Total */}
        <ListItem sx={{ py: 0, px: 0 }}>
          <ListItemText
            primary={
              <Typography sx={{ color: '#93c5fd' }}>
                Total
              </Typography>
            }
          />
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#60a5fa' }}>
            {`$${(totalPrice + 9.99).toFixed(2)}`}
          </Typography>
        </ListItem>
      </List>
    </Box>
  );
};

export default OrderSummary;