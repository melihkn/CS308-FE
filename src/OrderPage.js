// OrderPage.js

/*

Functionality of OrderPage component:
    - The OrderPage component is a functional component that displays the orders of a logged-in user.
    - It fetches the orders of the user from the server using the user ID.
    - It displays the order details including order ID, order date, total price, payment status, order status, and the items in each order.
    - If the user is not logged in, it displays a message asking the user to log in to view the orders.
    - If there are no orders for the user, it displays a message indicating that there are no orders.

*/

import React, { useEffect, useState } from "react";
import Order from "./Order";
import axios from "axios";

const OrderPage = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8004/api/orders/customer/${userId}`);
        setOrders(response.data); // Set orders for the logged-in user
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  if (loading) return <p>Loading orders...</p>;

  return (
    <div style={{ width: "80%", margin: "auto" }}>
      <h1>Your Orders</h1>
      {orders.map((order) => (
        <Order key={order.order_id} order={order} />
      ))}
    </div>
  );
};

export default OrderPage;
