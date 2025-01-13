import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ListIcon from "@mui/icons-material/List";
import { tokens } from "../theme";
import { useTheme } from "@mui/material/styles";

const Profile = ({ userProfile }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [wishlistName, setWishlistName] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const theme = useTheme();
  const mode = theme.palette.mode;
  const colors = tokens(mode);

  useEffect(() => {
    const loggedIn = JSON.parse(localStorage.getItem("isLoggedIn")) || false;
    setIsLoggedIn(loggedIn);

    if (!loggedIn) {
      navigate("/login");
    }
  }, [navigate]);

  const handleViewWishlists = () => {
    navigate(`/wishlists`);
  };

  const handleCreateWishlist = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setWishlistName("");
  };

  const handleSubmitWishlist = async () => {
    try {
      await axios.post("http://127.0.0.1:8005/api/wishlists/create", {
        name: wishlistName,
        customer_id: localStorage.getItem("token"),
        wishlist_status: "active",
      });
      setSnackbarMessage("Wishlist created successfully!");
      setSnackbarOpen(true);
      handleCloseDialog();
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setSnackbarMessage("Wishlist with the same name already exists.");
      } else {
        setSnackbarMessage("An error occurred while creating the wishlist.");
      }
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: 4,
        backgroundColor: mode === "dark" ? colors.primary[500] : colors.grey[900],
        color: colors.grey[100],
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
                backgroundColor: mode === "dark" ? colors.primary[400] : colors.grey[50],
                color: mode === "dark" ? colors.grey[100] : "black",
              }}
            >
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  margin: "0 auto",
                  mb: 2,
                  bgcolor: colors.blueAccent[500],
                  color: colors.grey[100],
                }}
              >
                <AccountCircleIcon sx={{ fontSize: 50 }} />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {userProfile.name} {userProfile.surname}
              </Typography>
              <Typography variant="body2" color={mode === "dark" ? colors.grey[300] : colors.grey[700]}>
                {userProfile.email}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Button
                variant="contained"
                sx={{
                  mb: 1,
                  backgroundColor: colors.blueAccent[500],
                  color: colors.grey[100],
                  "&:hover": { backgroundColor: colors.blueAccent[600] },
                }}
                fullWidth
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
                backgroundColor: mode === "dark" ? colors.primary[400] : colors.grey[50],
                color: mode === "dark" ? colors.grey[100] : "black",
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
                    <ShoppingCartIcon sx={{ mr: 1, color: colors.blueAccent[500] }} /> Your Orders
                  </Typography>
                  <Typography variant="body2" color={mode === "dark" ? colors.grey[300] : colors.grey[700]}>
                    Track, return, or buy items.
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      mt: 1,
                      backgroundColor: colors.greenAccent[500],
                      color: colors.grey[100],
                      "&:hover": { backgroundColor: colors.greenAccent[600] },
                    }}
                    onClick={() => navigate("/orders")}
                  >
                    View Orders
                  </Button>
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* Wishlists Section */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", display: "flex", alignItems: "center" }}
                  >
                    <ListIcon sx={{ mr: 1, color: colors.greenAccent[500] }} /> Your Wishlists
                  </Typography>
                  <Typography variant="body2" color={mode === "dark" ? colors.grey[300] : colors.grey[700]}>
                    View and manage your wishlists.
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: colors.blueAccent[500],
                        color: colors.grey[100],
                        "&:hover": { backgroundColor: colors.blueAccent[600] },
                      }}
                      onClick={handleViewWishlists}
                    >
                      View Wishlists
                    </Button>
                    <Button
                      variant="outlined"
                      sx={{
                        borderColor: colors.greenAccent[500],
                        color: colors.greenAccent[500],
                        "&:hover": {
                          backgroundColor: colors.greenAccent[100],
                          borderColor: colors.greenAccent[500],
                        },
                      }}
                      onClick={handleCreateWishlist}
                    >
                      Create Wishlist
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <Typography variant="h6" color={mode === "dark" ? colors.grey[300] : colors.grey[700]}>
            Loading Profile...
          </Typography>
        </Box>
      )}

      {/* Create Wishlist Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Create New Wishlist</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Wishlist Name"
            type="text"
            fullWidth
            variant="outlined"
            value={wishlistName}
            onChange={(e) => setWishlistName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmitWishlist}
            variant="contained"
            sx={{
              bgcolor: colors.blueAccent[500],
              color: colors.grey[100],
              "&:hover": { bgcolor: colors.blueAccent[600] },
            }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default Profile;
