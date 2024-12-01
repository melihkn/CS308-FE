import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PaymentPage.css';

function PaymentPage() {
  const location = useLocation();
  const { cartItems = [], userId = null } = location.state || {};
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cvc, setCvc] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const navigate = useNavigate();

  const handlePayment = async () => {
    if (!cartItems.length) {
      alert("Cart is empty!");
      return;
    }

    // Calculate total price
    const totalPrice = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

    const orderData = {
      customer_id: userId,
      total_price: totalPrice,
      order_date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
      payment_status: "paid",
      invoice_link: null,
      order_status: 0,
      items: cartItems.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_purchase: item.price,
      }))
    };

    try {
      // Process the order
      const response = await fetch('http://127.0.0.1:8004/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Order creation failed');
      }

      const order = await response.json();
      alert("Payment successful and order created successfully!"); 
      //alert(`Order created successfully! Order ID: ${order.order_id}, Total Price: $${order.total_price}`);

      // Clear the shopping cart
      await clearShoppingCart();

      // Navigate to the orders page
      navigate('/orders');
    } catch (error) {
      console.error('Order creation failed:', error);
      alert(`Order creation failed: ${error.message}`);
    }
  };

  const clearShoppingCart = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8001/cart/clear?customer_id=${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to clear shopping cart');
      }

    } catch (error) {
      console.error('Failed to clear shopping cart:', error);
      alert(`Failed to clear shopping cart: ${error.message}`);
    }
  };

  return (
    <div className="PaymentPage">
      <h2>Payment Page</h2>
      <ul>
        {cartItems.map((item, index) => (
          <li key={index}>
            Product ID: {item.product_id}, Quantity: {item.quantity}, Price: ${item.price.toFixed(2)}
          </li>
        ))}
      </ul>
      <input type="text" placeholder="Delivery Address" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} />
      <input type="text" placeholder="Card Number" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
      <input type="text" placeholder="CVC" value={cvc} onChange={(e) => setCvc(e.target.value)} />
      <input type="text" placeholder="Expiry Month" value={expiryMonth} onChange={(e) => setExpiryMonth(e.target.value)} />
      <input type="text" placeholder="Expiry Year" value={expiryYear} onChange={(e) => setExpiryYear(e.target.value)} />
      <button onClick={handlePayment}>Finish Payment</button>
    </div>
  );
}

export default PaymentPage;
