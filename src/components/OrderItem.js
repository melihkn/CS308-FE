import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Chip, Button, CardMedia } from "@mui/material";
import { useNavigate } from "react-router-dom";

const OrderItem = ({ productId, quantity, purchase_price }) => {
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8002/products/${productId}`);
        const productData = response.data;

        // Prefix the image URL
        const image_url_prefix = "http://127.0.0.1:8001/static/";
        const fullImageUrl = image_url_prefix + productData.image_url;
        setProduct({ ...productData, image_url: fullImageUrl });
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  if (!product) return <p>Loading product details...</p>;

  // Ensure purchase_price is safe to display
  const safePrice = purchase_price ?? 0;

  const handleProductClick = () => {
    navigate(`/product-detail/${productId}`);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mb: 2,
        p: 1,
        border: "1px solid #ccc",
        borderRadius: 2,
      }}
    >
      {/* Product Image */}
      <CardMedia
        component="img"
        image={product.image_url}
        alt={product.name}
        sx={{ width: 50, height: 50, objectFit: "contain", mr: 2 }}
      />

      {/* Product Name and Quantity */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Typography variant="body1" fontWeight="bold">
          {product.name}
        </Typography>
        <Chip label={`Quantity: ${quantity}`} size="small" sx={{ mt: 0.5 }} />
      </Box>

      {/* Product Price */}
      <Typography variant="body2" sx={{ mx: 2 }}>
        ${safePrice.toFixed(2)}
      </Typography>

      {/* Button to Product Detail */}
      <Button
        variant="outlined"
        size="small"
        onClick={handleProductClick}
        sx={{ textTransform: "none" }}
      >
        View Details
      </Button>
    </Box>
  );
};

export default OrderItem;