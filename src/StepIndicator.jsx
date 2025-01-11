import React from 'react';
import { Box, Stepper, Step, StepLabel, Typography } from '@mui/material';
import { styled } from '@mui/system';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircleIcon from '@mui/icons-material/Circle';

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
  // Helper to determine icon & color states
  const renderStepProps = (stepIndex) => {
    // Step is "done" if activeStep > stepIndex
    const isDone = activeStep > stepIndex;
    // Step is "current" if activeStep === stepIndex
    const isCurrent = activeStep === stepIndex;
    // Step is "future" if activeStep < stepIndex

    if (isDone) {
      // Done step → green check icon
      return {
        icon: <CheckCircleIcon sx={{ color: 'green' }} />,
        labelColor: 'green',
        iconBg: 'green',
      };
    } else if (isCurrent) {
      // Current step → purple circle
      return {
        icon: <CircleIcon sx={{ color: 'lightgrey' }} />,
        labelColor: 'lightgrey',
        iconBg: 'lightgrey',
      };
    } else {
      // Future step → gray circle
      return {
        icon: <CircleIcon sx={{ color: 'gray' }} />,
        labelColor: 'gray',
        iconBg: 'transparent',
      };
    }
  };

  return (
    <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        Step Progress
      </Typography>
      <CustomStepper activeStep={activeStep} alternativeLabel>
        {/* Step 0 */}
        <Step>
          {(() => {
            const { icon, labelColor, iconBg } = renderStepProps(0);
            return (
              <StepLabel
                icon={icon}
                sx={{
                  color: labelColor,
                  '& .MuiStepLabel-icon': {
                    backgroundColor: iconBg,
                    color: 'white',
                  },
                }}
              >
                Shipping address
              </StepLabel>
            );
          })()}
        </Step>

        {/* Step 1 */}
        <Step>
          {(() => {
            const { icon, labelColor, iconBg } = renderStepProps(1);
            return (
              <StepLabel
                icon={icon}
                sx={{
                  color: labelColor,
                  '& .MuiStepLabel-icon': {
                    backgroundColor: iconBg,
                    color: 'white',
                  },
                }}
              >
                Payment details
              </StepLabel>
            );
          })()}
        </Step>

        {/* Step 2 */}
        <Step>
          {(() => {
            const { icon, labelColor, iconBg } = renderStepProps(2);
            return (
              <StepLabel
                icon={icon}
                sx={{
                  color: labelColor,
                  '& .MuiStepLabel-icon': {
                    backgroundColor: iconBg,
                    color: 'white',
                  },
                }}
              >
                Review your order
              </StepLabel>
            );
          })()}
        </Step>
      </CustomStepper>
    </Box>
  );
};

export default StepIndicator;