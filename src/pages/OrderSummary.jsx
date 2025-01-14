import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  useTheme,
} from '@mui/material';

const OrderSummary = ({ cartItems, totalPrice }) => {
  // Access the current theme (light or dark)
  const theme = useTheme();

  // Conditionally pick a color for the "Total" based on theme mode
  // (just as an example, you can pick any colors you want)
  const totalColor = theme.palette.mode === 'dark'
    ? '#93c5fd' // lighter blue for dark mode
    : '#3b82f6'; // normal accent blue for light mode

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 'bold',
          mb: 2,
          textAlign: 'center',
          borderBottom: `2px solid ${theme.palette.primary.main}`,
          pb: 1,
        }}
      >
        Order Summary
      </Typography>

      <List disablePadding>
        {cartItems.map((item, index) => {
          const discountRate = item.discount_rate || 0;
          const discountedPrice = item.price - item.price * (discountRate / 100);

          return (
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
              <Typography
                sx={{
                  color: theme.palette.info.main,
                  fontWeight: 500,
                }}
              >
                {item.name}
              </Typography>

              {/* Quantity */}
              <Typography sx={{ color: theme.palette.text.secondary }}>
                Quantity: {item.quantity}
              </Typography>

              {/* Original Price */}
              <Typography sx={{ color: theme.palette.text.secondary }}>
                Original Price: ${item.price.toFixed(2)}
              </Typography>

              {/* Discount */}
              {discountRate > 0 && (
                <Typography sx={{ color: theme.palette.error.main }}>
                  Discount: {discountRate}% off
                </Typography>
              )}

              {/* Discounted Price */}
              {discountRate > 0 && (
                <Typography sx={{ color: theme.palette.text.secondary }}>
                  Discounted Price: ${discountedPrice.toFixed(2)}
                </Typography>
              )}
            </ListItem>
          );
        })}

        <Divider
          sx={{
            my: 2,
            borderColor: theme.palette.primary.light,
          }}
        />

        {/* Shipping */}
        <ListItem sx={{ py: 0, px: 0 }}>
          <ListItemText
            primary={
              <Typography sx={{ color: theme.palette.info.dark }}>
                Shipping
              </Typography>
            }
          />
          <Typography sx={{ fontWeight: 'bold', color: theme.palette.info.dark }}>
            $9.99
          </Typography>
        </ListItem>

        {/* Total */}
        <ListItem sx={{ py: 0, px: 0 }}>
          <ListItemText
            primary={
              <Typography sx={{ color: theme.palette.info.dark }}>
                Total
              </Typography>
            }
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: totalColor, // Use the conditional color
            }}
          >
            {`$${(totalPrice + 9.99).toFixed(2)}`}
          </Typography>
        </ListItem>
      </List>
    </Box>
  );
};

export default OrderSummary;