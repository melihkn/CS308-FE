import React, { useEffect, useState } from "react";
import { fetchAllProducts } from "../api";
import ProductCard from "../components/ProductCard";
import { useNavigate } from "react-router-dom";
import { Grid } from "@mui/material";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchAllProducts();
      setProducts(data);
    };
    loadProducts();
  }, []);

  return (
    <Grid container spacing={2} sx={{ padding: 2 }}>
      {products.map((product) => (
        <Grid item xs={12} sm={6} md={4} key={product.id}>
          <ProductCard
            product={product}
            onViewDetails={(id) => navigate(`/product/${id}`)}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductPage;
