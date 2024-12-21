// OrderItem.js

/*

Functionality of OrderItem component:
    - The OrderItem component is a functional component that displays the details of an item in an order.
    - It fetches the product details from the product listing service using the product ID.
    - It displays the product image, name, description, quantity, and purchase price of the item in the order.
    - It fetches the image from the authentication service mounted images but url is gotten from the product listing service.

*/
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Chip } from "@mui/material";

const OrderItem = ({ productId, quantity, purchase_price }) => {
  const [product, setProduct] = useState(null);

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

  // in some orders, there might not be items, to avoid some errors
  const safePrice = purchase_price ?? 0; // Default to 0 if purchase_price is undefined or null

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
      <Typography variant="body2">
        Product ID: {productId}
      </Typography>
      <Chip label={`Qty: ${quantity}`} size="small" />
      <Typography variant="body2">
        ${purchase_price.toFixed(2)}
      </Typography>
    </Box>
  );
};

export default OrderItem;
