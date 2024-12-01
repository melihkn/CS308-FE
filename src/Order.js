// Order Component in the OrderPage component

/*
Functionalities of the Order component:
    - The Order component is a functional component that displays the details of an order.
    - It displays the order date, total price, payment status, and order status of the order.
    - It iterates over the items in the order and renders an OrderItem component for each item.
    - It uses the ORDER_STATUS_MAP object to map the order status from a numerical value to a text value.
    - It displays the order status as text to the user.
*/
import React from "react";
import { useNavigate } from "react-router-dom";
import OrderItem from "./OrderItem";

// Define the ORDER_STATUS_MAP object
const ORDER_STATUS_MAP = {
  0: "Pending",
  1: "Processing",
  2: "Shipped",
  3: "Delivered",
  4: "Cancelled",
  5: "Returned",
};

const Order = ({ order }) => {
  // bu variable ile order ın status unu text olarak user a yansıtabilicez. 
  const orderStatusText = ORDER_STATUS_MAP[order.order_status] || "Unknown Status";

  // useNavigate hook to navigate to the comment page
  const navigate = useNavigate();
  const handleCommentRedirect = () => {
    navigate(`/comment/${order.order_id}`);
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        marginBottom: "20px",
        padding: "20px",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
        <div>
          <strong>Order Date:</strong> {new Date(order.order_date).toLocaleDateString()}
        </div>
        <div>
          <strong>Total Price:</strong> ${order.total_price.toFixed(2)}
        </div>
        <div>
          <strong>Payment Status:</strong> {order.payment_status}
        </div>
        <div>
          <strong>Order Status:</strong> {orderStatusText}
        </div>
      </div>
      {order.items.map((item) => (
        <OrderItem
          key={item.product_id}
          productId={item.product_id}
          quantity={item.quantity}
          purchase_price={item.price}
        />
      ))}
      {/* Add the Comment button */}
      <button
        style={{
          marginTop: "15px",
          padding: "5px 10px",
          backgroundColor: "#ffaa00",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px",
        }}
        onClick={handleCommentRedirect}
      >
        Make a comment about product
      </button>
    </div>
  );
};

export default Order;