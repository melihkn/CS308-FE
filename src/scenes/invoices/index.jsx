import { useEffect, useState } from "react";
import { Box, Typography, useTheme, Button, Modal } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { fetchOrders, fetchOrderItems, fetchProducts } from "../../api/smAPI";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const Invoices = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);

  // Tarih filtreleme state'leri
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Filtrelenmiş siparişleri tutan state
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersData = await fetchOrders();
        const formattedOrders = ordersData.map((order) => ({
          id: order.order_id,
          customer_id: order.customer_id,
          total_price: order.total_price,
          order_date: new Date(order.order_date).toLocaleString(),
          order_status: order.order_status,
          payment_status: order.payment_status,
          invoice_link: order.invoice_link || "Not Available",
        }));
        setOrders(formattedOrders);
        setFilteredOrders(formattedOrders); // Başlangıçta tüm siparişleri göster

        const productsData = await fetchProducts();
        setProducts(productsData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Tarih filtreleme işlemi
    if (startDate && endDate) {
      const filtered = orders.filter((order) => {
        const orderDate = new Date(order.order_date);
        return orderDate >= startDate.toDate() && orderDate <= endDate.toDate();
      });
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders);
    }
  }, [startDate, endDate, orders]);

  const handleClearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setFilteredOrders(orders); // Tüm siparişleri yeniden göster
  };

  const handleOrderDetails = async (orderId) => {
    try {
      const orderItems = await fetchOrderItems();
      const filteredItems = orderItems
        .filter((item) => item.order_id === orderId)
        .map((item) => {
          const product = products.find((p) => p.product_id === item.product_id);
          return {
            ...item,
            product_name: product ? product.name : "Unknown Product",
            serial_number: product ? product.serial_number : "Unknown Serial Number",
          };
        });

      setOrderDetails(filteredItems);
      setModalOpen(true);
    } catch (error) {
      console.error("Error fetching order items:", error);
    }
  };

  const handleViewInvoice = (order_id) => {
    window.open(`/invoice/${order_id}`, "_blank");
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setOrderDetails([]);
  };

  const columns = [
    { field: "id", headerName: "Order ID", flex: 1 },
    { field: "customer_id", headerName: "Customer ID", flex: 1 },
    { field: "total_price", headerName: "Total Price ($)", flex: 1 },
    { field: "order_date", headerName: "Order Date", flex: 1 },
    { field: "order_status", headerName: "Order Status", flex: 1 },
    { field: "payment_status", headerName: "Payment Status", flex: 1 },
    {
      field: "invoice_link",
      headerName: "Invoices",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => handleViewInvoice(params.row.id)}
        >
          View Invoice
        </Button>
      ),
    },
    {
      field: "details",
      headerName: "Details",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => handleOrderDetails(params.row.id)}
        >
          View Items
        </Button>
      ),
    },
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box m="20px">
        <Header title="Invoices" subtitle="List of Orders and Invoices" />

        {/* Tarih filtreleme alanı */}
        <Box display="flex" gap="20px" mb={2} alignItems="center">
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={handleClearFilters}
          >
            Clear Filters
          </Button>
        </Box>

        {/* DataGrid */}
        <Box
          m="40px 0 0 0"
          height="75vh"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[700],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary[400],
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: colors.blueAccent[700],
            },
          }}
        >
          {loading ? (
            <Typography color="white">Loading...</Typography>
          ) : (
            <DataGrid rows={filteredOrders} columns={columns} />
          )}
        </Box>

        {/* Order Details Modal */}
        <Modal open={isModalOpen} onClose={handleCloseModal}>
          <Box
            p={4}
            sx={{
              backgroundColor: colors.primary[400],
              color: colors.grey[100],
              width: "50%",
              margin: "100px auto",
              borderRadius: "8px",
            }}
          >
            <Typography variant="h6" mb={2}>
              Order Details
            </Typography>
            {orderDetails.length > 0 ? (
              <Box>
                {orderDetails.map((item, index) => (
                  <Box key={index} mb={2}>
                    <Typography>
                      <strong>Product Name:</strong> {item.product_name}
                    </Typography>
                    <Typography>
                      <strong>Serial Number:</strong> {item.serial_number}
                    </Typography>
                    <Typography>
                      <strong>Quantity:</strong> {item.quantity}
                    </Typography>
                    <Typography>
                      <strong>Price at Purchase:</strong> ${item.price_at_purchase}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography>No items found for this order.</Typography>
            )}
          </Box>
        </Modal>
      </Box>
    </LocalizationProvider>
  );
};

export default Invoices;
