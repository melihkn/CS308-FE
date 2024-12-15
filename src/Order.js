// Order Component in the OrderPage component

/*
Functionalities of the Order component:
    - The Order component is a functional component that displays the details of an order.
    - It displays the order date, total price, payment status, and order status of the order.
    - It iterates over the items in the order and renders an OrderItem component for each item.
    - It uses the ORDER_STATUS_MAP object to map the order status from a numerical value to a text value.
    - It displays the order status as text to the user.
*/
import React from "react";
import { useNavigate } from "react-router-dom";
import OrderItem from "./OrderItem";
import { useTheme } from "@mui/material/styles"; // To access theme properties
import { Box, Button, Typography } from "@mui/material";

// Define the ORDER_STATUS_MAP object
const ORDER_STATUS_MAP = {
  0: "Pending",
  1: "Processing",
  2: "Shipped",
  3: "Delivered",
  4: "Cancelled",
  5: "Returned",
};

const Order = ({ order }) => {
  const theme = useTheme(); // Access current theme
  const colors = theme.palette; // Extract palette from theme

  // Map order status to text
  const orderStatusText = ORDER_STATUS_MAP[order.order_status] || "Unknown Status";

  // useNavigate hook to navigate to the comment page
  const navigate = useNavigate();
  const handleCommentRedirect = () => {
    navigate(`/comment/${order.order_id}`);
  };

  // Function to handle invoice view
  const handleViewInvoice = () => {
    console.log("Navigating to invoice with ID:", order.order_id);
    navigate(`/invoice/${order.order_id}`);
  };

  return (
    <Box
      sx={{
        border: `1px solid ${colors.neutral.main}`,
        marginBottom: "20px",
        padding: "20px",
        borderRadius: "8px",
        backgroundColor: colors.background.default,
        fontFamily: theme.typography.fontFamily,
        color: colors.text?.primary || colors.neutral.main, // Ensure text visibility
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
        <Typography>
          <strong>Order Date:</strong> {new Date(order.order_date).toLocaleDateString()}
        </Typography>
        <Typography>
          <strong>Total Price:</strong> ${order.total_price.toFixed(2)}
        </Typography>
        <Typography>
          <strong>Payment Status:</strong> {order.payment_status}
        </Typography>
        <Typography>
          <strong>Order Status:</strong> {orderStatusText}
        </Typography>
      </Box>
      {order.items.map((item) => (
        <OrderItem
          key={item.product_id}
          productId={item.product_id}
          quantity={item.quantity}
          purchase_price={item.price}
        />
      ))}
      {/* Invoice and Comment buttons */}
      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "15px" }}>
        <Button
          sx={{
            padding: "5px 10px",
            backgroundColor: colors.primary.main,
            color: theme.palette.getContrastText(theme.palette.primary.main),
            "&:hover": {
              backgroundColor: colors.primary.dark,
            },
          }}
          onClick={handleViewInvoice}
        >
          View Invoice
        </Button>
        <Button
          sx={{
            padding: "5px 10px",
            backgroundColor: colors.secondary.main,
            color: colors.text?.primary || "#fff",
            "&:hover": {
              backgroundColor: colors.secondary.dark,
            },
          }}
          onClick={handleCommentRedirect}
        >
          Make a Comment About Product
        </Button>
      </Box>
    </Box>
  );
};

export default Order;
