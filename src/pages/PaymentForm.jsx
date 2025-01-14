import React from 'react';
import { Box, TextField, Typography, Button, Grid, InputAdornment } from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
// Use MUI arrow icons
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const PaymentForm = ({ cardDetails, setCardDetails, onBack, onNext }) => {
  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, ''); // Sadece rakamları al
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim(); // Her 4 rakamdan sonra boşluk ekle
  };

  const handleCardNumberChange = (e) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardDetails({ ...cardDetails, cardNumber: formattedValue });
  };

  const isCardNumberValid = cardDetails.cardNumber.replace(/\s/g, '').length === 16;
  const isCvvValid = /^\d{3}$/.test(cardDetails.cvc);
  const isExpiryMonthValid = /^[1-9]$|^(1[0-2])$/.test(cardDetails.expiryMonth);
  const isExpiryYearValid = /^\d{4}$/.test(cardDetails.expiryYear) && parseInt(cardDetails.expiryYear, 10) > 2024;
  const isFormValid = isCardNumberValid && isCvvValid && isExpiryMonthValid && isExpiryYearValid;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Credit Card
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Card number *"
            variant="outlined"
            fullWidth
            margin="normal"
            placeholder="0000 0000 0000 0000"
            value={cardDetails.cardNumber}
            onChange={handleCardNumberChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CreditCardIcon sx={{ color: 'gray' }} />
                </InputAdornment>
              ),
            }}
            error={!isCardNumberValid && cardDetails.cardNumber.trim() !== ''}
            helperText={
              !isCardNumberValid && cardDetails.cardNumber.trim() !== ''
                ? 'Card number must be 16 digits'
                : ''
            }
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Name *"
            variant="outlined"
            fullWidth
            margin="normal"
            placeholder="John Smith"
            value={cardDetails.name || ''}
            onChange={(e) =>
              setCardDetails({ ...cardDetails, name: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            label="CVV *"
            variant="outlined"
            fullWidth
            margin="normal"
            placeholder="123"
            value={cardDetails.cvc}
            onChange={(e) =>
              setCardDetails({ ...cardDetails, cvc: e.target.value })
            }
            error={!isCvvValid && cardDetails.cvc.trim() !== ''}
            helperText={
              !isCvvValid && cardDetails.cvc.trim() !== '' ? 'CVV must be 3 digits' : ''
            }
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            label="Expiration date *"
            variant="outlined"
            fullWidth
            margin="normal"
            placeholder="MM/YY"
            value={`${cardDetails.expiryMonth || ''}/${cardDetails.expiryYear || ''}`}
            onChange={(e) => {
              const [month, year] = e.target.value.split('/');
              setCardDetails({
                ...cardDetails,
                expiryMonth: month || '',
                expiryYear: year || '',
              });
            }}
            error={
              (!isExpiryMonthValid && cardDetails.expiryMonth.trim() !== '') ||
              (!isExpiryYearValid && cardDetails.expiryYear.trim() !== '')
            }
            helperText={
              !isExpiryMonthValid && cardDetails.expiryMonth.trim() !== ''
                ? 'Month must be between 1 and 12'
                : !isExpiryYearValid && cardDetails.expiryYear.trim() !== ''
                ? 'Year must be greater than 2024'
                : ''
            }
          />
        </Grid>
      </Grid>

      {/* Butonlar: Back (left arrow), Next (right arrow) */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          variant="outlined"
          sx={{
            backgroundColor: 'white',
            color: 'primary.main',
            border: '1px solid lightgray',
            ':hover': {
              backgroundColor: 'lightgray',
              color: 'primary.main',
            },
          }}
          onClick={onBack}
          startIcon={<ArrowBackIosNewIcon />} // Left arrow
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={onNext}
          disabled={!isFormValid}
          endIcon={<ArrowForwardIosIcon />} // Right arrow
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default PaymentForm;