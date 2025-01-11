import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Grid } from '@mui/material';

const AddressForm = ({
  addressFields,
  setAddressFields,
  setDeliveryAddress,
  onNext
}) => {
  const [error, setError] = useState(false);

  const handleFieldChange = (field, value) => {
    setAddressFields((prev) => ({ ...prev, [field]: value }));
    setError(false);
  };

  const handleZipCodeChange = (value) => {
    // ZIP Code only digits allowed
    if (/^\d*$/.test(value)) {
      setAddressFields((prev) => ({ ...prev, zipCode: value }));
      setError(false);
    }
  };

  const handleNext = () => {
    const requiredFields = [
      'firstName',
      'lastName',
      'addressLine1',
      'city',
      'state',
      'zipCode',
      'country',
      // 'addressType' // If you want Address Type to be required, uncomment
    ];

    const isValid = requiredFields.every(
      (field) => addressFields[field]?.trim() !== ''
    );

    if (!isValid) {
      setError(true);
    } else {
      setError(false);
      // Combine the address into a single string if you need it
      const fullAddress = `
        ${addressFields.firstName} ${addressFields.lastName},
        ${addressFields.addressLine1},
        ${addressFields.addressLine2 ? addressFields.addressLine2 + ',' : ''}
        ${addressFields.city},
        ${addressFields.state},
        ${addressFields.zipCode},
        ${addressFields.country}
      `
        .replace(/\s+/g, ' ')
        .trim();

      setDeliveryAddress(fullAddress);
      onNext();
    }
  };

  return (
    <Box>
      {/* Page Title */}
      <Typography variant="h6" gutterBottom>
        Address
      </Typography>

      <Grid container spacing={2}>
        {/* Address Type (Optional or Required if you want) */}
        <Grid item xs={12}>
          <TextField
            label="Address Type"
            variant="outlined"
            fullWidth
            value={addressFields.addressType}
            onChange={(e) => handleFieldChange('addressType', e.target.value)}
            // error={error && !addressFields.addressType?.trim()}
            // helperText={error && !addressFields.addressType?.trim() ? 'Required' : ''}
          />
        </Grid>

        {/* First Name */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="First Name"
            variant="outlined"
            fullWidth
            required
            value={addressFields.firstName}
            onChange={(e) => handleFieldChange('firstName', e.target.value)}
            error={error && !addressFields.firstName?.trim()}
            helperText={
              error && !addressFields.firstName?.trim() ? 'Required' : ''
            }
          />
        </Grid>

        {/* Last Name */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Last Name"
            variant="outlined"
            fullWidth
            required
            value={addressFields.lastName}
            onChange={(e) => handleFieldChange('lastName', e.target.value)}
            error={error && !addressFields.lastName?.trim()}
            helperText={
              error && !addressFields.lastName?.trim() ? 'Required' : ''
            }
          />
        </Grid>

        {/* Address Line 1 */}
        <Grid item xs={12}>
          <TextField
            label="Address Line 1"
            variant="outlined"
            fullWidth
            required
            value={addressFields.addressLine1}
            onChange={(e) => handleFieldChange('addressLine1', e.target.value)}
            error={error && !addressFields.addressLine1?.trim()}
            helperText={
              error && !addressFields.addressLine1?.trim() ? 'Required' : ''
            }
          />
        </Grid>

        {/* Address Line 2 */}
        <Grid item xs={12}>
          <TextField
            label="Address Line 2"
            variant="outlined"
            fullWidth
            value={addressFields.addressLine2}
            onChange={(e) => handleFieldChange('addressLine2', e.target.value)}
          />
        </Grid>

        {/* City */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="City"
            variant="outlined"
            fullWidth
            required
            value={addressFields.city}
            onChange={(e) => handleFieldChange('city', e.target.value)}
            error={error && !addressFields.city?.trim()}
            helperText={
              error && !addressFields.city?.trim() ? 'Required' : ''
            }
          />
        </Grid>

        {/* State */}
        <Grid item xs={12} sm={3}>
          <TextField
            label="State"
            variant="outlined"
            fullWidth
            required
            value={addressFields.state}
            onChange={(e) => handleFieldChange('state', e.target.value)}
            error={error && !addressFields.state?.trim()}
            helperText={
              error && !addressFields.state?.trim() ? 'Required' : ''
            }
          />
        </Grid>

        {/* Zip Code */}
        <Grid item xs={12} sm={3}>
          <TextField
            label="Zip / Postal Code"
            variant="outlined"
            fullWidth
            required
            value={addressFields.zipCode}
            onChange={(e) => handleZipCodeChange(e.target.value)}
            error={error && !addressFields.zipCode?.trim()}
            helperText={
              error && !addressFields.zipCode?.trim()
                ? 'Required and must be numeric'
                : ''
            }
          />
        </Grid>

        {/* Country */}
        <Grid item xs={12}>
          <TextField
            label="Country"
            variant="outlined"
            fullWidth
            required
            value={addressFields.country}
            onChange={(e) => handleFieldChange('country', e.target.value)}
            error={error && !addressFields.country?.trim()}
            helperText={
              error && !addressFields.country?.trim() ? 'Required' : ''
            }
          />
        </Grid>
      </Grid>

      {/* Next Button */}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          sx={{
            ':hover': {
              backgroundColor: 'darkgray',
            },
          }}
          onClick={handleNext}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default AddressForm;