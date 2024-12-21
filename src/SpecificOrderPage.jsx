import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Checkbox,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { LocalShipping, AttachMoney, CalendarToday, LocationOn } from "@mui/icons-material";

import { requestRefund } from "./api.js";

const SpecificOrderPage = () => {
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://127.0.0.1:8004/api/orders/${orderId}`);
        setOrderDetails(response.data);
        console.log("Order details: ", response.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
        setSnackbar({ open: true, message: "Failed to fetch order details", severity: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleProductSelect = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleRefundRequest = async () => {
    try {
      const refundRequest = {
        order_id: orderId,
        product_id_list: selectedProducts,
        reason: "User requested refund",
      };
      let response;
      console.log("Refund request:", refundRequest);
      response = await requestRefund(refundRequest);
      setSnackbar({ open: true, message: "Refund request submitted successfully", severity: "success" });
    } catch (error) {
      console.error("Error processing refund:", error);
      setSnackbar({ open: true, message: "Failed to process refund request", severity: "error" });
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product-detail/${productId}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!orderDetails) {
    return <Typography>No order details found.</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 1200, margin: "auto", mt: 4, px: 2 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Order Details - #{orderDetails.order_id}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <CalendarToday sx={{ mr: 1 }} />
                <Typography>
                  <strong>Order Date:</strong> {new Date(orderDetails.order_date).toLocaleDateString()}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <AttachMoney sx={{ mr: 1 }} />
                <Typography>
                  <strong>Total Price:</strong> {orderDetails.total_price}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <LocalShipping sx={{ mr: 1 }} />
                <Typography>
                  <strong>Order Status:</strong>{" "}
                  <Chip
                    label={orderDetails.order_status}
                    color={orderDetails.order_status === "Delivered" ? "success" : "primary"}
                    size="small"
                  />
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <LocationOn sx={{ mr: 1 }} />
                <Typography>
                  <strong>Delivery Address:</strong> {orderDetails.address}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Refund Request
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Select the products you wish to refund and click the button below.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleRefundRequest}
                disabled={selectedProducts.length === 0}
                fullWidth
              >
                Refund Selected Products
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: "bold" }}>
        Order Items
      </Typography>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedProducts.length > 0 && selectedProducts.length < orderDetails.items.length}
                  checked={selectedProducts.length === orderDetails.items.length}
                  onChange={() =>
                    setSelectedProducts(
                      selectedProducts.length === orderDetails.items.length
                        ? []
                        : orderDetails.items.map((item) => item.product_id)
                    )
                  }
                />
              </TableCell>
              <TableCell>Product</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderDetails.items.map((item) => (
              <TableRow 
                key={item.product_id} 
                hover
                onClick={() => handleProductClick(item.product_id)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedProducts.includes(item.product_id)}
                    onChange={() => handleProductSelect(item.product_id)}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <CardMedia
                      component="img"
                      sx={{ width: 50, height: 50, objectFit: "contain", mr: 2 }}
                      image={item.image_url ? `http://127.0.0.1:8001/static/${item.image_url}` : "/placeholder.svg"}
                      alt={item.name}
                    />
                    <Typography>{item.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">{item.quantity}</TableCell>
                <TableCell align="right">${item.price}</TableCell>
                <TableCell align="right">
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick(item.product_id);
                    }}
                  >
                    View Product
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SpecificOrderPage;

