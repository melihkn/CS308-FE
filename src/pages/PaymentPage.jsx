import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Snackbar,
  Alert
} from '@mui/material';
import AddressForm from './AddressForm';
import PaymentForm from './PaymentForm';
import Review from './Review';
import OrderSummary from './OrderSummary';
import StepIndicator from './StepIndicator';

function PaymentPage() {
  const location = useLocation();
  const { cartItems = [], userId = null } = location.state || {};
  const navigate = useNavigate();

  // Adım durumları
  const [step, setStep] = useState(1);

  // Adres bilgileri (tek bir string yerine, her alanı ayrı saklıyoruz)
  const [addressFields, setAddressFields] = useState({
    firstName: '',
    lastName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    addressType: '', // Adres tipini de eklediyseniz
  });

  // Birleştirilmiş adres metni
  const [deliveryAddress, setDeliveryAddress] = useState('');

  // Kart bilgileri
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cvc: '',
    expiryMonth: '',
    expiryYear: '',
  });

  // -- İNDİRİMLİ TOPLAM (discount) HESABI --
  const discountedTotalPrice = cartItems.reduce((sum, item) => {
    const discountRate = item.discount_rate || 0;
    const discountedPrice = item.price - item.price * (discountRate / 100);
    return sum + discountedPrice * item.quantity;
  }, 0);

  // -- SNACKBAR STATE --
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success', // 'error', 'info', 'warning', 'success'
  });

  // Yeni oluşturulan siparişin ID'sini tutmak için
  const [newOrderId, setNewOrderId] = useState(null);

  // Token alma fonksiyonu
  const getToken = () => localStorage.getItem('token');

  // Sepeti temizleme
  const clearShoppingCart = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8001/cart/clear?customer_id=${userId}`,
        { method: 'DELETE' }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to clear shopping cart');
      }
    } catch (error) {
      console.error('Failed to clear shopping cart:', error);
      setSnackbar({
        open: true,
        message: `Failed to clear shopping cart: ${error.message}`,
        severity: 'error',
      });
    }
  };

  // Sipariş oluşturma & ödeme tamamlama
  const handlePayment = async () => {
    try {
      if (!cartItems.length) {
        alert('Cart is empty!');
        return;
      }

      const orderData = {
        customer_id: userId,
        total_price: discountedTotalPrice,
        order_date: new Date().toISOString().split('T')[0],
        order_address: deliveryAddress,
        order_address_type: addressFields.addressType || 'Home',
        order_address_name: null,
        payment_status: 'paid',
        invoice_link: null,
        order_status: 0,
        items: cartItems.map((item) => {
          const discountRate = item.discount_rate || 0;
          const discountedPrice = item.price - (item.price * (discountRate / 100));
          return {
            product_id: item.product_id,
            quantity: item.quantity,
            price_at_purchase: discountedPrice,
            real_price: item.price,
          };
        }),
      };

      const token = getToken();
      if (!token) throw new Error('Authentication token is missing.');

      const response = await fetch('http://127.0.0.1:8004/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Order creation failed');
      }

      // Başarılı yanıt => sipariş oluşturuldu
      const order = await response.json();
      // Yeni order ID'sini sakla
      setNewOrderId(order.order_id);

      // Snackbar aç
      setSnackbar({
        open: true,
        message: 'Payment successful and order created successfully!',
        severity: 'success',
      });

      // Sepeti temizle
      await clearShoppingCart();
    } catch (error) {
      console.error('Order creation failed:', error);
      setSnackbar({
        open: true,
        message: `Order creation failed: ${error.message}`,
        severity: 'error',
      });
    }
  };

  // Snackbar kapanırken yapılacaklar
  const handleCloseSnackbar = (event, reason) => {
    // 'clickaway' -> arka plana tıklama
    if (reason === 'clickaway') {
      event.stopPropagation(); // Tıklamanın yayılmasını durdur
      return;
    }

    // Snackbar'ı kapat
    setSnackbar({ ...snackbar, open: false });

    // Eğer işlem başarılıydı ve newOrderId mevcutsa
    if (snackbar.severity === 'success' && newOrderId) {
      // Snackbar kapandıktan sonra invoice sayfasına git
      navigate(`/invoice/${newOrderId}`);
    }
  };

  // Adımların içeriğini döndüren fonksiyon
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <AddressForm
            addressFields={addressFields}
            setAddressFields={setAddressFields}
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
            totalPrice={discountedTotalPrice}
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
          <OrderSummary cartItems={cartItems} totalPrice={discountedTotalPrice} />
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

      {/* SNACKBAR BİLDİRİMİ */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default PaymentPage;