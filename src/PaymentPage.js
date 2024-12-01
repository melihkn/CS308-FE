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

    try {
      const response = await fetch('http://127.0.0.1:8004/orders/payment/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          deliveryAddress,
          paymentDetails: { cardNumber, cvc, expiryMonth, expiryYear },
          cartItems: cartItems.map(item => ({ productId: item.productId, quantity: item.quantity })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Payment failed');
      }

      alert('Payment successful!');
      navigate('/orders');
    } catch (error) {
      console.error('Payment failed:', error);
      alert(`Payment failed: ${error.message}`);
    }
  };

  return (
    <div className="PaymentPage">
      <h2>Payment Page</h2>
      <ul>
        {cartItems.map((item, index) => (
          <li key={index}>
            Product ID: {item.productId}, Quantity: {item.quantity}
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
