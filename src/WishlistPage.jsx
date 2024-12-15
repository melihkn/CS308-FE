import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
} from "@mui/material";
import axios from "axios";

const BACKEND_URL = "http://127.0.0.1:8005/api";

const WishlistPage = ({ userId }) => {
  const [wishlists, setWishlists] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlists = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/wishlists/get/${userId}`);
        setWishlists(response.data);
      } catch (error) {
        console.error("Error fetching wishlists:", error);
      }
    };

    fetchWishlists();
  }, [userId]);

  const handleViewItems = (wishlistId) => {
    console.log("Navigating with wishlistId:", wishlistId); // Debugging
    // return the wishlist items page with the wishlist id
    navigate(`/wishlist/${wishlistId}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Your Wishlists
      </Typography>
      <Grid container spacing={3}>
        {/* Wishlists : wishlist_id, wishlist_status, name are the columns of this object  */}
        {wishlists.map((wishlist) => (
          <Grid item xs={12} sm={6} md={4} key={wishlist.wishlist_id}>
            <Card
              sx={{
                backgroundColor: "background.paper",
                color: "text.primary",
              }}
            >
              <CardContent>
                <Typography variant="h6">{wishlist.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Status: {wishlist.wishlist_status}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() => handleViewItems(wishlist.wishlist_id)}
                >
                  View Items
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default WishlistPage;
