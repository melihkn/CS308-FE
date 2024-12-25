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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { LocalShipping, AttachMoney, CalendarToday, LocationOn, Cancel as CancelIcon } from "@mui/icons-material";
import { requestRefund, refundStatusCall, cancelOrder} from "../api/api";
import SpecificOrderItem from "../components/SpecificOrderItem";

const ORDER_STATUS_MAP = {
  0: { text: "Pending", color: "warning" },
  1: { text: "Processing", color: "info" },
  2: { text: "Shipped", color: "primary" },
  3: { text: "Delivered", color: "success" },
  4: { text: "Cancelled", color: "error" },
  5: { text: "Returned", color: "secondary" },
};

const SpecificOrderPage = () => {
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const [loading, setLoading] = useState(true);
  const [refundStatus, setRefundStatus] = useState({});
  const [openRefundModal, setOpenRefundModal] = useState(false);
  const [refundReasons, setRefundReasons] = useState({});
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [refundNumber, setRefundNumber] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://127.0.0.1:8004/api/orders/${orderId}`);
      console.log(response.data);
      setOrderDetails(response.data);
      // Fetch refund status for each product
      console.log("Initialization:", response.data.items);
      const refundStatusPromises = response.data.items.map(item =>
        refundStatusCall(orderId, item.product_id)
      );
      const refundStatusResponses = await Promise.all(refundStatusPromises);
      console.log(refundStatusResponses);
      const updatedRefundStatus = { ...refundStatus };

      // Update the refund status map
      refundStatusResponses.forEach((data) => {
        updatedRefundStatus[data.product_id] = data.status;
      });
      
      setRefundStatus(updatedRefundStatus);
    } catch (error) {
      console.error("Error fetching order details or refund status:", error);
      setSnackbar({ open: true, message: "Failed to fetch order details or refund status", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleProductSelect = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
    if (!refundReasons[productId]) {
      setRefundReasons((prev) => ({ ...prev, [productId]: "" }));
    }
  };

  const handleRefundReasonChange = (productId, reason) => {
    setRefundReasons((prev) => ({ ...prev, [productId]: reason }));
  };

  const handleRefundRequest = () => {
    if (selectedProducts.length > 0) {
      setOpenRefundModal(true);
    } else {
      setSnackbar({ open: true, message: "Please select at least one product for refund", severity: "warning" });
    }
  };

  const handleRefundSubmit = async () => {
    try {
      console.log("Submitting refund requests for products:", selectedProducts);
      console.log("Sonuc:", refundStatus);
      selectedProducts.forEach(productId => {
        if (refundStatus[productId] !== "N/A") {
          throw new Error("Tekrar deneyin");
        }
      });
      const refundRequest = {
        order_id: orderId,
        product_id_list: selectedProducts,
        reason: selectedProducts.map(productId => refundReasons[productId] || null),
      };
      console.log(refundRequest);
      const refundResponse = requestRefund(refundRequest);
      console.log(refundResponse);
      setSnackbar({ open: true, message: "Refund requests submitted successfully", severity: "success" });
      
      // Refresh refund status for the selected products
      const refundStatusPromises = selectedProducts.map(productId =>
        refundStatusCall(orderId, productId)
      );
      const refundStatusResponses = await Promise.all(refundStatusPromises);
      console.log(refundStatusResponses);
      // Create a new refund status map
      const updatedRefundStatus = { ...refundStatus };

      refundStatusResponses.forEach((data) => {
        updatedRefundStatus[data.product_id] = data.status;
      });

      // Update the state with the new map
      setRefundStatus(updatedRefundStatus);

      setRefundNumber(refundNumber + 1);

      // Reset selected products and reasons
      setSelectedProducts([]);
      setRefundReasons({});

      fetchOrderDetails();
    } catch (error) {
      console.error("Error processing refund:", error);
      setSnackbar({ open: true, message: "Failed to process refund requests", severity: "error" });
    } finally {
      setOpenRefundModal(false);
    }
  };

  const handleCancelOrder = async () => {
    setOpenCancelModal(true);
  };

  const handleCancelSubmit = async () => {
    try {

      if (orderDetails.order_status !== 0) {
        throw new Error("Order cannot be cancelled");
      }
      const cancelRequest = {
        order_id: orderId,
        reason: cancelReason,
      };
      const response = await cancelOrder(cancelRequest);
      setSnackbar({ open: true, message: "Order cancelled successfully", severity: "success" });
      // Refresh order details
      orderDetails.order_status = response.status; // Cancelled
      fetchOrderDetails();
    } catch (error) {
      console.error("Error cancelling order:", error);
      setSnackbar({ open: true, message: "Failed to cancel order", severity: "error" });
    } finally {
      setOpenCancelModal(false);
      setCancelReason("");
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
                  <strong>Total Price:</strong> ${orderDetails.total_price}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <LocalShipping sx={{ mr: 1 }} />
                <Typography>
                  <strong>Order Status:</strong>{" "}
                  <Chip
                    label={ORDER_STATUS_MAP[orderDetails.order_status].text}
                    color={ORDER_STATUS_MAP[orderDetails.order_status].color}
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
                Order Actions
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleRefundRequest}
                disabled={selectedProducts.length === 0 || orderDetails.order_status !== 3}
                fullWidth
                sx={{ mb: 2 }}
              >
                Request Refund for Selected Products
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCancelOrder}
                startIcon={<CancelIcon />}
                fullWidth
                sx={{ mb: 2 }}
                disabled = {orderDetails.order_status !== 0 || selectedProducts.some(productId => refundStatus[productId] !== "N/A")}
              >
                Cancel Order
              </Button>
              <Typography variant="body2" color="text.secondary">
                Note: Cancellation may not be possible if the order has been shipped or delivered.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: "bold" }}>
        Order Items and Refund Status
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
              <TableCell>Image</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Refund Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderDetails.items.map((item) => (
              <SpecificOrderItem
                key={item.product_id}
                productId={item.product_id}
                quantity={item.quantity}
                price={item.price}
                refundStatus={refundStatus[item.product_id]}
                onProductSelect={handleProductSelect}
                isSelected={selectedProducts.includes(item.product_id)}
                onProductClick={handleProductClick}
                changed = {refundNumber}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openRefundModal} onClose={() => setOpenRefundModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Request Refund for Selected Products</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide a reason for each product you wish to refund:
          </DialogContentText>
          {selectedProducts.map((productId) => {
            const product = orderDetails.items.find(item => item.product_id === productId);
            return (
              <Box key={productId} sx={{ my: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {product.name}
                </Typography>
                <TextField
                  margin="dense"
                  id={`refund-reason-${productId}`}
                  label={`Refund Reason for ${productId}`}
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={refundReasons[productId] || ""}
                  onChange={(e) => handleRefundReasonChange(productId, e.target.value)}
                />
              </Box>
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRefundModal(false)}>Cancel</Button>
          <Button onClick={handleRefundSubmit} variant="contained" color="primary">
            Submit Refund Requests
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openCancelModal} onClose={() => setOpenCancelModal(false)}>
        <DialogTitle>Cancel Order</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide a reason for cancelling this order:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="cancel-reason"
            label="Cancellation Reason"
            type="text"
            fullWidth
            variant="outlined"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCancelModal(false)}>Back</Button>
          <Button onClick={handleCancelSubmit} variant="contained" color="secondary">
            Confirm Cancellation
          </Button>
        </DialogActions>
      </Dialog>

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

