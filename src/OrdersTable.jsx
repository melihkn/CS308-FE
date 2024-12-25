import React, { useState, useEffect } from 'react';
import {
  DataGrid,
  GridToolbar,
} from '@mui/x-data-grid';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { fetchOrders, updateOrderStatus } from './api'; // Replace './apiService' with the actual path to your Axios functions

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [productsModalOpen, setProductsModalOpen] = useState(false);
  const [selectedOrderProducts, setSelectedOrderProducts] = useState([]);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [selectedInvoiceUrl, setSelectedInvoiceUrl] = useState('');
  const [loadingInvoice, setLoadingInvoice] = useState(false);

  // Fetch orders on mount
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const fetchedOrders = await fetchOrders();
        setOrders(
          fetchedOrders.map((order, index) => ({
            id: index + 1,
            ...order,
            totalPrice: order.price,
            deliveryAddress: order.address,
            products: order.products.map((product) => ({
              productId: product.product_id,
              name: product.product_name,
              quantity: product.quantity,
              price: product.price_at_purchase,
            })),
          }))
        );
      } catch (error) {
        setSnackbar({ open: true, message: 'Failed to fetch orders', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const handleEditClick = (order) => {
    setEditingOrder(order);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingOrder(null);
  };

  const handleSaveOrder = async () => {
    if (editingOrder) {
      try {
        await updateOrderStatus({ order_id: editingOrder.orderId, status: editingOrder.status });
        setOrders(
          orders.map((order) =>
            order.id === editingOrder.id ? { ...order, status: editingOrder.status } : order
          )
        );
        setSnackbar({ open: true, message: 'Order status updated successfully', severity: 'success' });
      } catch (error) {
        setSnackbar({ open: true, message: 'Failed to update order status', severity: 'error' });
      } finally {
        handleCloseDialog();
      }
    }
  };

  const handleStatusChange = (e) => {
    setEditingOrder({
      ...editingOrder,
      status: e.target.value,
    });
  };

  const handleViewProducts = (products) => {
    setSelectedOrderProducts(products);
    setProductsModalOpen(true);
  };

  const columns = [
    { field: 'orderId', headerName: 'Order ID', width: 130 },
    { field: 'deliveryId', headerName: 'Delivery ID', width: 130 },
    { field: 'totalPrice', headerName: 'Total Price', width: 110, valueFormatter: (params) => formatCurrency(params.value) },
    { field: 'deliveryAddress', headerName: 'Delivery Address', width: 250 },
    { field: 'status', headerName: 'Status', width: 120 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 350,
      renderCell: (params) => (
        <Box>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<VisibilityIcon />}
            onClick={() => handleViewProducts(params.row.products)}
            sx={{ mr: 1 }}
          >
            Products
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<EditIcon />}
            onClick={() => handleEditClick(params.row)}
            sx={{ mr: 1 }}
          >
            Edit Status
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Orders Management
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgress />
        </Box>
      ) : (
        <DataGrid
          rows={orders}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          checkboxSelection
          disableSelectionOnClick
          components={{
            Toolbar: GridToolbar,
          }}
        />
      )}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Edit Order Status</DialogTitle>
        <DialogContent>
          {editingOrder && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
              <Typography variant="body1">Order ID: {editingOrder.orderId}</Typography>
              <FormControl fullWidth>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  value={editingOrder.status}
                  onChange={handleStatusChange}
                  label="Status"
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Shipped">Shipped</MenuItem>
                  <MenuItem value="Delivered">Delivered</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveOrder} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OrdersTable;
