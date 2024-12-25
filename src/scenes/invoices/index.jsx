import { useEffect, useState } from "react";
import { Box, Typography, useTheme, Button, Modal } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { fetchOrders, fetchOrderItems, fetchProducts } from "../../smapi/smAPI"; // API functions
import Header from "../../components/Header";
import { tokens } from "../../theme";

const Invoices = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [orders, setOrders] = useState([]); // Orders data
  const [products, setProducts] = useState([]); // Products data for lookup
  const [loading, setLoading] = useState(true); // Loading state
  const [orderDetails, setOrderDetails] = useState([]); // Order item details
  const [isModalOpen, setModalOpen] = useState(false); // Modal state

  // Fetch orders and products when the component loads
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch orders
        const ordersData = await fetchOrders();
        const formattedOrders = ordersData.map((order) => ({
          id: order.order_id, // DataGrid requires a unique `id`
          customer_id: order.customer_id,
          total_price: order.total_price,
          order_date: new Date(order.order_date).toLocaleString(),
          order_status: order.order_status,
          payment_status: order.payment_status,
          invoice_link: order.invoice_link || "Not Available",
        }));
        setOrders(formattedOrders);

        // Fetch products for lookup
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

  // View order details (fetch order items)
  const handleOrderDetails = async (orderId) => {
    try {
      const orderItems = await fetchOrderItems();
      const filteredItems = orderItems
        .filter((item) => item.order_id === orderId)
        .map((item) => {
          // Find the product by product_id in the fetched products array
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

  // Close modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setOrderDetails([]); // Clear order details
  };

  // DataGrid columns
  const columns = [
    { field: "customer_id", headerName: "Customer ID", flex: 1 },
    { field: "total_price", headerName: "Total Price ($)", flex: 1 },
    { field: "order_date", headerName: "Order Date", flex: 1 },
    { field: "order_status", headerName: "Order Status", flex: 1 },
    { field: "payment_status", headerName: "Payment Status", flex: 1 },
    {
      field: "invoice_link",
      headerName: "Invoice Link",
      flex: 1,
      renderCell: (params) => (
        <a
          href={params.row.invoice_link}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: colors.blueAccent[400],
            textDecoration: "none",
          }}
        >
          View Invoice
        </a>
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
    <Box m="20px">
      <Header title="Invoices" subtitle="List of Orders and Invoices" />
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
          <DataGrid rows={orders} columns={columns} />
        )}
      </Box>

      {/* Order Details Modal */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
          p={4}
          sx={{
            backgroundColor: colors.primary[500],
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
  );
};

export default Invoices;
