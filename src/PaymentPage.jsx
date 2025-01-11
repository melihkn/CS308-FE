import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Container, Grid, Paper, Typography } from '@mui/material';
import AddressForm from './AddressForm';
import PaymentForm from './PaymentForm';
import Review from './Review';
import OrderSummary from './OrderSummary';
import StepIndicator from './StepIndicator';

function PaymentPage() {
  const location = useLocation();
  const { cartItems = [], userId = null } = location.state || {};
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  // 1. Instead of storing only a combined "deliveryAddress" string,
  //    let's store the full address fields so we can retain them 
  //    when the user navigates back and forth.
  const [addressFields, setAddressFields] = useState({
    firstName: '',
    lastName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  // You can still store an additional "deliveryAddress" string if needed,
  // but the addressFields object will be your source of truth for the form.
  const [deliveryAddress, setDeliveryAddress] = useState('');

  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cvc: '',
    expiryMonth: '',
    expiryYear: '',
  });

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const handlePayment = () => {
    alert('Order placed successfully!');
    // Payment logic here
    // navigate('/invoice'); 
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <AddressForm
            // 2. Pass addressFields and its setter down to the form
            addressFields={addressFields}
            setAddressFields={setAddressFields}
            // 3. Also pass a function to set the combined address string 
            //    if you still want that single string stored
            setDeliveryAddress={setDeliveryAddress}
            onNext={() => setStep(2)}
          />
        );
      case 2:
        return (
          <PaymentForm
            cardDetails={cardDetails}
            setCardDetails={setCardDetails}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        );
      case 3:
        return (
          <Review
            address={deliveryAddress}
            addressType={addressFields.addressType}
            cartItems={cartItems}
            totalPrice={totalPrice}
            cardDetails={cardDetails}
            onBack={() => setStep(2)}
            onPlaceOrder={handlePayment}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <StepIndicator activeStep={step - 1} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <OrderSummary cartItems={cartItems} totalPrice={totalPrice} />
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
              {step === 1 && 'Address'}
              {step === 2 && 'Payment'}
              {step === 3 && 'Review & Place Order'}
            </Typography>
            <Box sx={{ mt: 2 }}>{renderStep()}</Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default PaymentPage;