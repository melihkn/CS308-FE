
/*import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typography, Container, Grid } from "@mui/material";
import ProductCard from "./ProductCard";

const HomePage = ({isLoggedIn, userId}) => {
  const [products, setProducts] = useState([]); // Ürünleri tutar
  const [selectedCategory, setSelectedCategory] = useState(null); // Seçilen kategori id
  const BACKEND_URL = "http://127.0.0.1:8002";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = selectedCategory
          ? `${BACKEND_URL}/products/getproduct/category/${selectedCategory}` // category_id ile filtreleme
          : `${BACKEND_URL}/products`; // Tüm ürünleri getir
        const response = await axios.get(url);
        console.log("Response:", response.data)
        setProducts(response.data); // Ürünleri state'e ata
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [selectedCategory]); // selectedCategory değiştiğinde çağrılır

  const getImageUrl = (imageUrl) => `${BACKEND_URL}/static/${imageUrl}`;

  // <Container maxWidth="lg" sx={{ padding: "20px", display: "flex" }}> <CategorySidebar setSelectedCategory={setSelectedCategory} /> silindi
  return (
    <Container maxWidth="lg" sx={{ padding: "20px", display: "flex" }}>
      <div style={{flex: 1}}>
        <Typography variant="h3" align="center" gutterBottom>
          Welcome to MyTech!
        </Typography>
        <Typography variant="subtitle1" align="center" gutterBottom>
          Your one-stop shop for all your tech needs.
        </Typography>

        <Grid container spacing={4} sx={{ mt: 3 }}>
          {products.map((product) => (
            <Grid item key={product.product_id} xs={12} sm={6} md={4}>
              <ProductCard
                userId={userId}
                isLoggedIn={isLoggedIn}
                id={product.product_id}
                name={product.name}
                model={product.model}
                description={product.description}
                quantity={product.quantity}
                distributor={product.distributor}
                imageUrl={getImageUrl(product.image_url)}
              />
            </Grid>
          ))}
        </Grid>
      </div>
    </Container>
  );
};

export default HomePage;
*/

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typography, Container, Grid } from "@mui/material";
import ProductCard from "../components/ProductCard";

const HomePage = ({ isLoggedIn, userId, selectedCategory }) => {
  const [products, setProducts] = useState([]);
  const BACKEND_URL = "http://127.0.0.1:8002";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = selectedCategory
          ? `${BACKEND_URL}/products/getproduct/category/${selectedCategory}` // Fetch products by category
          : `${BACKEND_URL}/products`;
        const response = await axios.get(url);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  const getImageUrl = (imageUrl) => `${BACKEND_URL}/static/${imageUrl}`;

  return (
    <Container maxWidth="lg" sx={{ padding: "20px" }}>
      <Typography variant="h3" align="center" gutterBottom>
        Welcome to MyTech!
      </Typography>
      <Typography variant="subtitle1" align="center" gutterBottom>
        Your one-stop shop for all your tech needs.
      </Typography>

      {/* Product Grid */}
      <Grid container spacing={4} sx={{ mt: 3 }}>
        {products.map((product) => (
          <Grid item key={product.product_id} xs={12} sm={6} md={4}>
            <ProductCard
              userId={userId}
              isLoggedIn={isLoggedIn}
              id={product.product_id}
              name={product.name}
              model={product.model}
              description={product.description}
              quantity={product.quantity}
              distributor={product.distributor}
              imageUrl={getImageUrl(product.image_url)}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HomePage;
