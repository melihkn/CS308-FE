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
  CardMedia,
  IconButton,

} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import { fetchOrders, updateOrderStatus, fetchInvoice } from './api'; // Replace './apiService' with the actual path to your Axios functions
import { Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';


const STATUS_MAP = {
  0: 'PENDING',
  1: 'PROCESSING',
  2: 'SHIPPED',
  3: 'DELIVERED',
  4: 'CANCELLED',
  5: 'Returned',
};  

const INVERSE_STATUS_MAP = {
  "PENDING": 0,
  "PROCESSING": 1,
  "SHIPPED": 2,
  "DELIVERED": 3,
  "CANCELLED": 4,
  "Returned": 5,
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
  const [pdfUrl, setPdfUrl] = useState('');
  // Fetch orders on mount
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const fetchedOrders = await fetchOrders();
        console.log("fetchedOrders: ", fetchedOrders);
        setOrders(fetchedOrders);
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
        console.log("editingOrder: ", editingOrder);
        console.log("editingOrder.id: ", editingOrder.order_id);
        const status_ = INVERSE_STATUS_MAP[editingOrder.status];
        console.log("status: ", status_);

        const payload = {
          order_id: editingOrder.order_id,
          status: status_,
        }

        console.log("payload: ", payload);
        const response = await updateOrderStatus(payload);
        console.log("response: ", response);
        setOrders(
          orders.map((order) =>
            order.id === editingOrder.id ? { ...order, status: editingOrder.status } : order
          )
        );
        setSnackbar({ open: true, message: 'Order status updated successfully', severity: 'success' });
      } catch (error) {
        setSnackbar({ open: true, message: 'Failed to update order status', severity: 'error' });
        console.log("error: ", error);
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






  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };



  const handleViewInvoice = async (orderId) => {
    setLoadingInvoice(true);
    setInvoiceModalOpen(true);
    
    // Simulate fetching PDF from backend
    try {
      const invoice = await fetchInvoice(orderId);
      // Create a blob URL for the PDF
      const blob = await invoice.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);

    } catch (error) {
      console.error('Error fetching invoice:', error);
      setSnackbar({ open: true, message: 'Error fetching invoice', severity: 'error' });
    } finally {
      setLoadingInvoice(false);
    }
  };



  const columns = [
    { field: 'id', headerName: 'Order ID', width: 130 },
    { field: 'order_id', headerName: 'Delivery ID', width: 130 },
    { field: 'customer_id', headerName: 'Customer ID', width: 130 },
    {
      field: 'price',
      headerName: 'Total Price',
      flex: 1,
      renderCell: (params) => {
        // Add the dollar sign to the displayed value
        return `$${Number(params.value).toFixed(2)}`;
      },
    },
    { field: 'address', headerName: 'Delivery Address', width: 250 },
    {
      field: 'status',
      headerName: 'Status',
      align: 'center',
      width: 120,
      renderCell: (params) => (
          STATUS_MAP[params.value]
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 300,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleViewProducts(params.row.products)} color="primary">
            <VisibilityIcon />
          </IconButton>
          <IconButton onClick={() => handleViewInvoice(params.row.order_id)} color="primary">
            <ReceiptIcon />
          </IconButton>
          <IconButton onClick={() => handleEditClick(params.row)} color="primary">
            <EditIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Orders Management
      </Typography>
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
      <Dialog open={openDialog} onClose={handleCloseDialog} PaperProps={{
    sx: {
      width: "400px", // Set a custom width (optional)
    },
  }}>
        <DialogTitle>
          Edit Order Status
          <IconButton
            onClick={handleCloseDialog}
            color="error"
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon /> {/* Close icon for dismissing the dialog */}
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {editingOrder && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
              <Typography variant="body1">Order ID: {editingOrder.orderId}</Typography>
              <FormControl fullWidth>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  value={editingOrder.status}
                  onChange={handleStatusChange}
                  label="Status"
                >
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="SHIPPED">Shipped</MenuItem>
                  <MenuItem value="DELIVERED">Delivered</MenuItem>
                  <MenuItem value="CANCELLED">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <IconButton
            onClick={handleSaveOrder}
            color="primary"
            sx={{ marginLeft: "auto" }}
          >
            <SaveIcon /> {/* Save icon */}
          </IconButton>
        </DialogActions>
      </Dialog>

      <Modal
        open={productsModalOpen}
        onClose={() => setProductsModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 800,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2" gutterBottom>
            Order Products
            <IconButton
              onClick={() => setProductsModalOpen(false)}
              color="error"
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
              }}
            >
              <CloseIcon /> {/* Close icon for the modal */}
            </IconButton>
          </Typography>
          <Box sx={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={selectedOrderProducts.map((product, index) => ({
                id: index, // Ensure each row has a unique ID
                ...product,
              }))}
              columns={[
                {
                  field: "image_url",
                  headerName: "Image",
                  width: 100,
                  renderCell: (params) => (
                    <CardMedia
                      component="img"
                      sx={{ width: 50, height: 50, objectFit: "contain" }}
                      image={`http://127.0.0.1:8001/static/${params.value}` || "/placeholder.svg"}
                      alt={params.row.product_name}
                    />
                  ),
                },
                { field: "product_id", headerName: "Product ID", width: 150 },
                { field: "product_name", headerName: "Name", width: 200 },
                { field: "quantity", headerName: "Quantity", type: "number", width: 120 },
                {
                  field: "price_at_purchase",
                  headerName: "Price",
                  flex: 1,
                  renderCell: (params) => `$${Number(params.value).toFixed(2)}`,
                },
              ]}
              pageSize={5}
              rowsPerPageOptions={[5, 10]}
              checkboxSelection={false}
              disableSelectionOnClick
            />
          </Box>
        </Box>
      </Modal>

      <Modal
        open={invoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
        aria-labelledby="invoice-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            height: "80%",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="invoice-modal-title" variant="h6" component="h2" gutterBottom>
            Invoice PDF
            <IconButton
              onClick={() => setInvoiceModalOpen(false)}
              color="error"
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
              }}
            >
              <CloseIcon /> {/* Close icon for the modal */}
            </IconButton>
          </Typography>
          {loadingInvoice ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <iframe
              src={pdfUrl}
              title="Invoice PDF"
              style={{ width: "100%", height: "65vh" }}
              frameBorder="0"
            />
          )}
        </Box>
      </Modal>

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
}


export default OrdersTable;