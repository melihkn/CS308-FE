import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// this is the url of the backend service in which the images are stored in the static folder
const BACKEND_URL = "http://127.0.0.1:8001";

const ShoppingProductCard = ({
  name,
  model,
  description,
  quantity,
  distributor,
  imageUrl,
  price,
  onIncrease,
  onDecrease,
  onRemove,
}) => {
  const theme = useTheme(); // Access current theme
  const colors = theme.palette; // Extract palette from theme

  const getImageUrl = (imageUrl) => `${BACKEND_URL}/static/${imageUrl}`;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: "16px",
        padding: "16px",
        border: `1px solid ${colors.neutral.main}`,
        borderRadius: "8px",
        backgroundColor: colors.background.paper,
        color: colors.text.primary,
      }}
    >
      <Box
        component="img"
        src={getImageUrl(imageUrl)}
        alt={name}
        sx={{
          width: "120px",
          height: "120px",
          objectFit: "cover",
          borderRadius: "8px",
          border: `1px solid ${colors.neutral.light}`,
        }}
      />
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6">{name}</Typography>
        <Typography variant="body2">
          <strong>Model:</strong> {model}
        </Typography>
        <Typography variant="body2">{description}</Typography>
        <Typography variant="body2">
          <strong>Price:</strong> ${price.toFixed(2)}
        </Typography>
        <Typography variant="body2">
          <strong>Quantity:</strong> {quantity}
        </Typography>
        <Typography variant="body2">
          <strong>Distributor:</strong> {distributor}
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: "8px",
            marginTop: "8px",
          }}
        >
          {onDecrease && (
            <Button
              variant="contained"
              size="small"
              sx={{
                backgroundColor: colors.primary.main,
                color: colors.getContrastText(colors.primary.main),
                "&:hover": { backgroundColor: colors.primary.dark },
              }}
              onClick={onDecrease}
            >
              -
            </Button>
          )}
          {onIncrease && (
            <Button
              variant="contained"
              size="small"
              sx={{
                backgroundColor: colors.primary.main,
                color: colors.getContrastText(colors.primary.main),
                "&:hover": { backgroundColor: colors.primary.dark },
              }}
              onClick={onIncrease}
            >
              +
            </Button>
          )}
          {onRemove && (
            <Button
              variant="contained"
              size="small"
              sx={{
                backgroundColor: colors.error.main,
                color: colors.getContrastText(colors.error.main),
                "&:hover": { backgroundColor: colors.error.dark },
              }}
              onClick={onRemove}
            >
              Remove
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ShoppingProductCard;
