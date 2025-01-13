import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  CardMedia,
  Chip,
  IconButton,
  Rating,
} from "@mui/material";
import { Delete as DeleteIcon, Visibility as VisibilityIcon } from "@mui/icons-material";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";

const BACKEND_URL = "http://127.0.0.1:8005/api";
const PRODUCT_BACKEND_URL = "http://127.0.0.1:8002/products";

const WishlistItemsPage = () => {
  const [items, setItems] = useState([]);
  const [detailedItems, setDetailedItems] = useState([]);
  const navigate = useNavigate();
  const { wishlistId } = useParams();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

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

  useEffect(() => {
    const fetchDetailedItems = async () => {
      try {
        const detailedItems = await Promise.all(
          items.map(async (item) => {
            const detailedResponse = await axios.get(`${PRODUCT_BACKEND_URL}/${item.product_id}`);
            return { ...detailedResponse.data, wishlist_item_id: item.wishlist_item_id };
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

  const handleRemoveItem = async (wishlistItemId) => {
    try {
      await axios.delete(`${BACKEND_URL}/wishlist_items/delete/${wishlistItemId}`);
      setDetailedItems(detailedItems.filter((item) => item.wishlist_item_id !== wishlistItemId));
    } catch (error) {
      console.error("Error removing wishlist item:", error);
    }
  };

  const handleNavigateToProduct = (productId) => {
    navigate(`/product-detail/${productId}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Wishlist Items
      </Typography>
      {detailedItems.length === 0 ? (
        <>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ textAlign: "center", marginTop: 4 }}
          >
            Ohh, it's a quiet place...
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ textAlign: "center", marginTop: 4 }}
          >
            You do not have any products in your wishlist.
          </Typography>
        </>
      ) : (
        <Grid container spacing={3}>
          {detailedItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.wishlist_item_id}>
              <Card
                sx={{
                  maxWidth: 345,
                  borderRadius: 4,
                  transition: "transform 0.3s ease-in-out",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
                onClick={() => handleNavigateToProduct(item.product_id)}
              >
                <Box sx={{ position: "relative" }}>
                  {item.quantity <= 0 && (
                    <Chip
                      label="Out of Stock"
                      color="error"
                      size="small"
                      sx={{ position: "absolute", top: 8, left: 8, zIndex: 1 }}
                    />
                  )}
                  {item.quantity > 0 && item.quantity <= 5 && (
                    <Chip
                      label="Low Stock"
                      color="warning"
                      size="small"
                      sx={{ position: "absolute", top: 8, left: 8, zIndex: 1 }}
                    />
                  )}
                  <CardMedia
                    component="img"
                    alt={item.name}
                    height="180"
                    image={`http://127.0.0.1:8002/static/${item.image_url}`}
                  />
                </Box>
                <CardContent
                  sx={{
                    height: 200,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="h6">{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Price:</strong> ${item.price}
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                    <Rating name="read-only-rating" value={item.average_rating || 0} precision={0.5} readOnly />
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveItem(item.wishlist_item_id);
                      }}
                      sx={{
                        color: colors.redAccent[500],
                        "&:hover": { color: colors.redAccent[600] },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default WishlistItemsPage;
