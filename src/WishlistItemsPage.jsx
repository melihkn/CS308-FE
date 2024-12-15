import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, Button, Grid, CardMedia } from "@mui/material";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const BACKEND_URL = "http://127.0.0.1:8005/api";
const PRODUCT_BACKEND_URL = "http://127.0.0.1:8002/products";

const WishlistItemsPage = () => {
  const [items, setItems] = useState([]);
  const [detailedItems, setDetailedItems] = useState([]); // Store detailed product info
  const navigate = useNavigate();
  const { wishlistId } = useParams(); // Retrieve wishlistId from the URL

  // Fetch wishlist items based on the wishlistId
  useEffect(() => {
    const fetchWishlistItems = async () => {
      if (!wishlistId) {
        console.error("Wishlist ID is missing or invalid.");
        return;
      }
      try {
        const response = await axios.get(`${BACKEND_URL}/wishlist_items/get/${wishlistId}`);
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching wishlist items:", error);
      }
    };

    fetchWishlistItems();
  }, [wishlistId]);

  // Fetch detailed product info for the items
  useEffect(() => {
    const fetchDetailedItems = async () => {
      try {
        const detailedItems = await Promise.all(
          items.map(async (item) => {
            const detailedResponse = await axios.get(`${PRODUCT_BACKEND_URL}/${item.product_id}`);
            return { ...detailedResponse.data, wishlist_item_id: item.wishlist_item_id }; // Include wishlist_item_id for remove functionality
          })
        );
        setDetailedItems(detailedItems);
      } catch (error) {
        console.error("Error fetching detailed product info:", error);
      }
    };

    if (items.length > 0) {
      fetchDetailedItems();
    }
  }, [items]);

  // Remove an item from the wishlist
  const handleRemoveItem = async (wishlistItemId) => {
    try {
      await axios.delete(`${BACKEND_URL}/wishlist_items/delete/${wishlistItemId}`);
      setDetailedItems(detailedItems.filter((item) => item.wishlist_item_id !== wishlistItemId));
    } catch (error) {
      console.error("Error removing wishlist item:", error);
    }
  };

  // Navigate to the product detail page
  const handleNavigateToProduct = (productId) => {
    navigate(`/product-detail/${productId}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Wishlist Items
      </Typography>
      <Grid container spacing={3}>
        {detailedItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.wishlist_item_id}>
            <Card sx={{ backgroundColor: "background.paper", color: "text.primary" }}>
              {/* Product Image */}
              <CardMedia
                component="img"
                height="180"
                image={`http://127.0.0.1:8002/static/${item.image_url}`}
                alt={item.name}
              />
              <CardContent>
                {/* Product Details */}
                <Typography variant="h6">{item.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, fontWeight: "bold" }}>
                  Price: ${item.price}
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ mt: 2, mr: 1 }}
                  onClick={() => handleRemoveItem(item.wishlist_item_id)}
                >
                  Remove
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() => handleNavigateToProduct(item.product_id)}
                >
                  View Product
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default WishlistItemsPage;
