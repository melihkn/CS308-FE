import React from 'react';
import { Box, Stepper, Step, StepLabel, Typography } from '@mui/material';
import { styled } from '@mui/system';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircleIcon from '@mui/icons-material/Circle';

// Stepper Bileşeni için özel stil
const CustomStepper = styled(Stepper)(({ theme }) => ({
  padding: '10px 0',
  backgroundColor: 'transparent',
  borderRadius: '10px',
  '& .MuiStepLabel-root': {
    fontSize: '16px',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
}));

const StepIndicator = ({ activeStep }) => {
  return (
    <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Step Progress</Typography>
      <CustomStepper activeStep={activeStep} alternativeLabel>
        <Step>
          <StepLabel
            icon={
              activeStep > 0 ? (
                <CheckCircleIcon sx={{ color: 'rgb(48, 63, 159)' }} />
              ) : (
                <CircleIcon sx={{ color: 'gray' }} />
              )
            }
            sx={{
              color: activeStep > 0 ? 'rgb(48, 63, 159)' : 'gray',
              '& .MuiStepLabel-icon': {
                backgroundColor: activeStep > 0 ? 'rgb(48, 63, 159)' : 'transparent',
                color: 'white',
              },
            }}
          >
            Shipping address
          </StepLabel>
        </Step>
        <Step>
          <StepLabel
            icon={
              activeStep > 1 ? (
                <CheckCircleIcon sx={{ color: 'rgb(48, 63, 159)' }} />
              ) : (
                <CircleIcon sx={{ color: 'gray' }} />
              )
            }
            sx={{
              color: activeStep > 1 ? 'rgb(48, 63, 159)' : 'gray',
              '& .MuiStepLabel-icon': {
                backgroundColor: activeStep > 1 ? 'rgb(48, 63, 159)' : 'transparent',
                color: 'white',
              },
            }}
          >
            Payment details
          </StepLabel>
        </Step>
        <Step>
          <StepLabel
            icon={
              activeStep > 2 ? (
                <CheckCircleIcon sx={{ color: 'rgb(48, 63, 159)' }} />
              ) : (
                <CircleIcon sx={{ color: 'gray' }} />
              )
            }
            sx={{
              color: activeStep > 2 ? 'rgb(48, 63, 159)' : 'gray',
              '& .MuiStepLabel-icon': {
                backgroundColor: activeStep > 2 ? 'rgb(48, 63, 159)' : 'transparent',
                color: 'white',
              },
            }}
          >
            Review your order
          </StepLabel>
        </Step>
      </CustomStepper>
    </Box>
  );
};

export default StepIndicator;