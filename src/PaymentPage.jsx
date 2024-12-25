import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Container, Grid, Paper, Typography } from '@mui/material';
import AddressForm from './AddressForm';  // Adres formunu içeren bileşen
import PaymentForm from './PaymentForm';  // Ödeme formunu içeren bileşen
import Review from './Review';  // İnceleme ve sipariş tamamlama bileşeni
import OrderSummary from './OrderSummary';  // Sipariş özeti bileşeni
import StepIndicator from './StepIndicator';  // Adım göstergesi bileşeni

function PaymentPage() {
  const location = useLocation();
  const { cartItems = [], userId = null } = location.state || {};
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [addressType, setAddressType] = useState('Home');
  const [addressName, setAddressName] = useState('');
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
    // Burada ödeme işlemini gerçekleştirebilirsiniz.
    // Ödeme başarılı olduktan sonra kullanıcıyı fatura sayfasına yönlendirebilirsiniz.
    // navigate('/invoice');  // Örneğin, ödeme sonrası faturayı görüntülemek için
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <AddressForm
            address={deliveryAddress}
            addressType={addressType}
            addressName={addressName}
            setAddress={setDeliveryAddress}
            setAddressType={setAddressType}
            setAddressName={setAddressName}
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
            addressType={addressType}
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
      <StepIndicator activeStep={step - 1} />  {/* Adım göstergesi */}
      
      <Grid container spacing={3}>
        {/* Sol Taraf: Order Summary */}
        <Grid item xs={12} md={4}>
          <OrderSummary cartItems={cartItems} totalPrice={totalPrice} />
        </Grid>

        {/* Sağ Taraf: Formlar */}
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