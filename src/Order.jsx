import React from "react";
import { useNavigate } from "react-router-dom";
import OrderItem from "./OrderItem";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
  Chip,
  Grid,
  Divider,
  IconButton,
  Collapse,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ShoppingCart as ShoppingCartIcon,
  Comment as CommentIcon,
  Receipt as ReceiptIcon,
} from "@mui/icons-material";

const ORDER_STATUS_MAP = {
  0: { text: "Pending", color: "warning" },
  1: { text: "Processing", color: "info" },
  2: { text: "Shipped", color: "primary" },
  3: { text: "Delivered", color: "success" },
  4: { text: "Cancelled", color: "error" },
  5: { text: "Returned", color: "secondary" },
};

const Order = ({ order }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = React.useState(false);

  const orderStatus = ORDER_STATUS_MAP[order.order_status] || { text: "Unknown Status", color: "default" };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleOrderClick = () => {
    navigate(`/order/${order.order_id}`);
    console.log(`Navigating to order details page: ${order.order_id}`);
  };

  const handleCommentRedirect = (e) => {
    e.stopPropagation();
    navigate(`/comment/${order.order_id}`);
  };

  const handleViewInvoice = (e) => {
    e.stopPropagation();
    navigate(`/invoice/${order.order_id}`);
  };

  const handleProductClick = (e, productId) => {
    e.stopPropagation(); // Prevent parent click event
    navigate(`/product-detail/${productId}`);
  };

  return (
    <Card sx={{ mb: 3, cursor: "pointer" }} onClick={handleOrderClick}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" component="div">
              Order #{order.order_id}
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              {new Date(order.order_date).toLocaleDateString()}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} container justifyContent="flex-end">
            <Chip
              label={orderStatus.text}
              color={orderStatus.color}
              size="small"
              icon={<ShoppingCartIcon />}
            />
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2">
              <strong>Total Price:</strong> ${order.total_price.toFixed(2)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2">
              <strong>Payment Status:</strong> {order.payment_status}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2">
              <strong>Items:</strong> {order.items.length}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions disableSpacing>
        <Button
          size="small"
          startIcon={<ReceiptIcon />}
          onClick={handleViewInvoice}
        >
          View Invoice
        </Button>
        <Button
          size="small"
          startIcon={<CommentIcon />}
          onClick={handleCommentRedirect}
        >
          Comment
        </Button>
        <IconButton
          sx={{
            marginLeft: "auto",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: (theme) =>
              theme.transitions.create("transform", {
                duration: theme.transitions.duration.shortest,
              }),
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleExpandClick();
          }}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse
        in={expanded}
        timeout="auto"
        unmountOnExit
        onClick={(e) => e.stopPropagation()}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Order Items:
          </Typography>
          {order.items.map((item) => (
            <OrderItem
              key={item.product_id}
              productId={item.product_id}
              quantity={item.quantity}
              purchase_price={item.price}
              onProductClick={(e) => handleProductClick(e, item.product_id)}
            />
          ))}
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default Order;
