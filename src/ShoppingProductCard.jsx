import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  Stack,
} from "@mui/material";

// Backend URL of the server where images are stored (static files)
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
  const getImageUrl = (imageUrl) => `${BACKEND_URL}/static/${imageUrl}`;

  return (
    <Card
      sx={{
        width: 250,
        margin: 2,
        textAlign: "center",
        boxShadow: 3,
        transition: "transform 0.2s ease-in-out",
        "&:hover": { transform: "scale(1.05)" },
      }}
    >
      <CardMedia
        component="img"
        height="250"
        image={getImageUrl(imageUrl)}
        alt={name}
      />
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Model:</strong> {model}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {description}
        </Typography>
        <Typography variant="body2" color="text.primary" sx={{ mt: 1 }}>
          <strong>Price:</strong> ${price}
        </Typography>
        <Typography variant="body2" color="text.primary">
          <strong>Quantity:</strong> {quantity}
        </Typography>
        <Typography variant="body2" color="text.primary">
          <strong>Distributor:</strong> {distributor}
        </Typography>
        <Stack
          direction="row"
          spacing={1}
          justifyContent="center"
          sx={{ mt: 2 }}
        >
          {onDecrease && (
            <Button variant="outlined" color="secondary" onClick={onDecrease}>
              -
            </Button>
          )}
          {onIncrease && (
            <Button variant="outlined" color="secondary" onClick={onIncrease}>
              +
            </Button>
          )}
          {onRemove && (
            <Button variant="contained" color="error" onClick={onRemove}>
              Remove
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ShoppingProductCard;
