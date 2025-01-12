import React from "react";
import { Grid, Box, Typography } from "@mui/material";
import ProductCard from "../components/ProductCard";

const ISFG_Product_Listing = ({ products }) => {
  const BACKEND_URL = "http://127.0.0.1:8002";
  const getImageUrl = (imageUrl) => `${BACKEND_URL}/static/${imageUrl}`;

  return (
    <Box sx={{ padding: "20px" }}>
      {products.length > 0 ? (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={product.product_id}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <ProductCard
                id={product.product_id}
                name={product.name}
                model={product.model}
                description={product.description}
                price  = {product.price}
                quantity={product.quantity}
                distributor={product.distributor}
                imageUrl={getImageUrl(product.image_url)}
                rating={product.average_rating}
                discountRate={product.discount_rate}
                
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="h6" color="textSecondary" align="center">
          No products found.
        </Typography>
      )}
    </Box>
  );
};

export default ISFG_Product_Listing;
