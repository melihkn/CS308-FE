import React, { useEffect, useState } from "react";
import { Container, Typography } from "@mui/material";
import Order from "./Order";
import axios from "axios";

const OrderPage = ({ userId }) => {
  const [orders, setOrders] = useState([]); // Initialize as an array
  const [loading, setLoading] = useState(true);

  // Function to get token from localStorage
  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        console.log("Fetching orders for user ID:", userId);

        // Retrieve token
        const token = getToken();
        if (!token) {
          console.error("Authentication token is missing.");
          setOrders([]); // Handle missing token
          return;
        }

        // Make API request with Authorization header
        const response = await axios.get(
          `http://127.0.0.1:8004/api/orders/customer/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data && Array.isArray(response.data)) {
          setOrders(response.data);
        } else {
          console.warn("Unexpected API response:", response.data);
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]); // Handle error case
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]); // Add dependency array

  if (loading) return <p>Loading orders...</p>;

  if (!orders || orders.length === 0) {
    return (
      <Container maxWidth="md">
        <Typography variant="h4" component="h1" gutterBottom>
          Your Orders
        </Typography>
        <Typography variant="body1">You have no orders yet.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Your Orders
      </Typography>
      {orders.map((order) => (
        <Order key={order.order_id} order={order} />
      ))}
    </Container>
  );
};

export default OrderPage;


/*import React, { useEffect, useState } from "react";
import { Container, Typography } from "@mui/material";
import Order from "./Order";
import axios from "axios";

const OrderPage = ({ userId }) => {
  const [orders, setOrders] = useState([]); // Initialize as an array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        console.log("Fetching orders for user ID:", userId);
        const response = await axios.get(`http://127.0.0.1:8004/api/orders/customer/${userId}`);
        if (response.data && Array.isArray(response.data)) {
          setOrders(response.data);
        } else {
          console.warn("Unexpected API response:", response.data);
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]); // Handle error case
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]); // Add dependency array

  if (loading) return <p>Loading orders...</p>;

  if (!orders || orders.length === 0) {
    return (
      <Container maxWidth="md">
        <Typography variant="h4" component="h1" gutterBottom>
          Your Orders
        </Typography>
        <Typography variant="body1">You have no orders yet.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Your Orders
      </Typography>
      {orders.map((order) => (
        <Order key={order.order_id} order={order}/>
      ))}
    </Container>
  );
};

export default OrderPage;
*/