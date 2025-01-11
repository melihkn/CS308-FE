import React, { useEffect, useState } from "react";
import { TableRow, TableCell, CardMedia, Checkbox, Chip } from "@mui/material";
import axios from "axios";

const SpecificOrderItem = ({ 
  productId, 
  quantity, 
  price, 
  refundStatus, 
  onProductSelect, 
  isSelected, 
  onProductClick,
  changed
}) => {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [refundStatus]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8002/products/${productId}`);
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  if (!product) {
    return (
      <TableRow>
        <TableCell colSpan={6}>Loading...</TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow hover sx={{ cursor: "pointer" }} onClick={() => onProductClick(productId)}>
      <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
        <Checkbox checked={isSelected} onChange={() => onProductSelect(productId)} />
      </TableCell>
      <TableCell>
        <CardMedia
          component="img"
          sx={{ width: 50, height: 50, objectFit: "contain" }}
          image={`http://127.0.0.1:8001/static/${product.image_url}` || "/placeholder.svg"}
          alt={product.name}
        />
      </TableCell>
      <TableCell>{product.name}</TableCell>
      <TableCell align="right">{quantity}</TableCell>
      <TableCell align="right">${price.toFixed(2)}</TableCell>
      <TableCell align="right">
        {refundStatus ? (
          <Chip
            label={refundStatus}
            color={
              refundStatus === "APPROVED"
                ? "success"
                : refundStatus === "PENDING"
                ? "warning"
                : refundStatus === "REJECTED"
                ? "error"
                : "default"
            }
          />
        ) : (
          "N/A"
        )}
      </TableCell>
    </TableRow>
  );
};

export default SpecificOrderItem;
