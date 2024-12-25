import React, { useState, useEffect } from 'react';
import { 
  DataGrid, 
  GridToolbar
} from '@mui/x-data-grid';
import { 
  Box, 
  Typography, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  FormControlLabel, 
  Checkbox,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const API_URL = 'https://your-api-url.com/api/orders'; // Replace with your actual API URL

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
        const method = editingOrder.id ? 'PUT' : 'POST';
        const url = editingOrder.id ? `${API_URL}/${editingOrder.id}` : API_URL;
        const response = await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingOrder),
        });
        if (!response.ok) {
          throw new Error('Failed to save order');
        }
        await fetchOrders();
        handleCloseDialog();
        setSnackbar({ open: true, message: 'Order saved successfully', severity: 'success' });
      } catch (err) {
        setSnackbar({ open: true, message: err.message, severity: 'error' });
      }
    }
  };

  const handleInputChange = (e) => {
    if (editingOrder) {
      setEditingOrder({
        ...editingOrder,
        [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
      });
    }
  };

  const handleDeleteOrder = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete order');
      }
      await fetchOrders();
      setSnackbar({ open: true, message: 'Order deleted successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    }
  };

  const columns = [
    { field: 'deliveryId', headerName: 'Delivery ID', width: 130 },
    { field: 'customerId', headerName: 'Customer ID', width: 130 },
    { field: 'productId', headerName: 'Product ID', width: 130 },
    { field: 'quantity', headerName: 'Quantity', type: 'number', width: 90 },
    { 
      field: 'totalPrice', 
      headerName: 'Total Price', 
      type: 'number', 
      width: 110,
      valueFormatter: (params) => formatCurrency(params.value),
    },
    { field: 'deliveryAddress', headerName: 'Delivery Address', width: 250 },
    { field: 'isCompleted', headerName: 'Completed', type: 'boolean', width: 110 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <Box>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<EditIcon />}
            onClick={() => handleEditClick(params.row)}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleDeleteOrder(params.row.id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Orders Management
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleEditClick({})}
        sx={{ mb: 2 }}
      >
        Add New Order
      </Button>
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
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editingOrder && editingOrder.id ? "Edit Order" : "Add New Order"}</DialogTitle>
        <DialogContent>
          {editingOrder && (
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
              <TextField
                name="deliveryId"
                label="Delivery ID"
                value={editingOrder.deliveryId || ''}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                name="customerId"
                label="Customer ID"
                value={editingOrder.customerId || ''}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                name="productId"
                label="Product ID"
                value={editingOrder.productId || ''}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                name="quantity"
                label="Quantity"
                type="number"
                value={editingOrder.quantity || ''}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                name="totalPrice"
                label="Total Price"
                type="number"
                value={editingOrder.totalPrice || ''}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                name="deliveryAddress"
                label="Delivery Address"
                value={editingOrder.deliveryAddress || ''}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={2}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="isCompleted"
                    checked={editingOrder.isCompleted || false}
                    onChange={handleInputChange}
                  />
                }
                label="Completed"
              />
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

