import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Divider,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SettingsIcon from "@mui/icons-material/Settings";
import FavoriteIcon from "@mui/icons-material/Favorite";

/*  
    Enhanced Profile Page - Ensures persistent login by checking localStorage.

    Props:
        - userProfile: user profile information such as email, name, surname, phone number
*/

const Profile = ({ userProfile }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Retrieve the login state from localStorage
    const loggedIn = JSON.parse(localStorage.getItem("isLoggedIn")) || false;
    setIsLoggedIn(loggedIn);

    if (!loggedIn) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: 4,
        backgroundColor: "#f7f7f7",
        p: 2,
        borderRadius: "8px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      {isLoggedIn && userProfile ? (
        <Grid container spacing={4}>
          {/* Left Section - Profile Picture and Info */}
          <Grid item xs={12} sm={4} md={3}>
            <Card
              sx={{
                padding: 2,
                textAlign: "center",
                boxShadow: 3,
                borderRadius: 2,
                backgroundColor: "#ffffff",
              }}
            >
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  margin: "0 auto",
                  mb: 2,
                  bgcolor: "primary.main",
                }}
              >
                <AccountCircleIcon sx={{ fontSize: 50 }} />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {userProfile.name} {userProfile.surname}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {userProfile.email}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mb: 1 }}
                onClick={() => alert("Edit Profile Feature Coming Soon!")}
              >
                Edit Profile
              </Button>
            </Card>
          </Grid>

          {/* Right Section - Account Details */}
          <Grid item xs={12} sm={8} md={9}>
            <Card
              sx={{
                padding: 2,
                boxShadow: 3,
                borderRadius: 2,
                backgroundColor: "#ffffff",
              }}
            >
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                  Your Account
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {/* Orders Section */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", display: "flex", alignItems: "center" }}
                  >
                    <ShoppingCartIcon sx={{ mr: 1 }} /> Your Orders
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Track, return, or buy items.
                  </Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{ mt: 1 }}
                    onClick={() => navigate("/orders")}
                  >
                    View Orders
                  </Button>
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* Wishlist Section */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", display: "flex", alignItems: "center" }}
                  >
                    <FavoriteIcon sx={{ mr: 1 }} /> Your Wishlist
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    View and manage items you've saved for later.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 1 }}
                    onClick={() => alert("Wishlist Feature Coming Soon!")}
                  >
                    View Wishlist
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <Typography variant="h6" color="text.secondary">
            Loading Profile...
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Profile;
