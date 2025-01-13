import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  IconButton,
  Dialog as ConfirmDialog,
  DialogContentText,
  Menu,
  MenuItem,
} from "@mui/material";
import { Delete as DeleteIcon, MoreVert as MoreVertIcon } from '@mui/icons-material';
import axios from "axios";
import {tokens} from "../theme.js";
import { useTheme } from "@mui/material/styles";

const BACKEND_URL = "http://127.0.0.1:8005/api";

const WishlistPage = ({ userId }) => {
  const [wishlists, setWishlists] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [wishlistName, setWishlistName] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const theme = useTheme(); // Access the current theme
  const navigate = useNavigate();
  const colors = theme.palette; // Extract the color palette
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [wishlistToDelete, setWishlistToDelete] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenuWishlistId, setOpenMenuWishlistId] = useState(null);

  useEffect(() => {
    fetchWishlists();
  }, [userId]);

  const fetchWishlists = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/wishlists/get/${localStorage.getItem("token")}`);
      setWishlists(response.data);
    } catch (error) {
      console.error("Error fetching wishlists:", error);
      setSnackbarMessage("Error fetching wishlists. Please try again.");
      setSnackbarOpen(true);
    }
  };

  const handleViewItems = (wishlistId) => {
    console.log("Navigating with wishlistId:", wishlistId); // Debugging
    navigate(`/wishlist/${wishlistId}`);
  };

  const handleCreateWishlist = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setWishlistName("");
  };

  const handleSubmitWishlist = async () => {
    if (!wishlistName.trim()) {
      setSnackbarMessage("Please enter a wishlist name");
      setSnackbarOpen(true);
      return;
    }
    try {
      await axios.post(`${BACKEND_URL}/wishlists/create`, {
        name: wishlistName,
        customer_id: localStorage.getItem("token"),
        wishlist_status: "active"
      });
      setSnackbarMessage("Wishlist created successfully!");
      setSnackbarOpen(true);
      handleCloseDialog();
      fetchWishlists(); // Refresh the list of wishlists
    } catch (error) {
      console.error("Error creating wishlist:", error);
      if (error.response?.status === 404) {
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

  const handleDeleteWishlist = async (wishlistId) => {
    try {
      await axios.delete(`${BACKEND_URL}/wishlists/delete/${wishlistId}`);
      setSnackbarMessage("Wishlist deleted successfully!");
      setSnackbarOpen(true);
      fetchWishlists(); // Refresh the list of wishlists
    } catch (error) {
      console.error("Error deleting wishlist:", error);
      setSnackbarMessage("An error occurred while deleting the wishlist.");
      setSnackbarOpen(true);
    }
    setDeleteDialogOpen(false);
    setWishlistToDelete(null);
  };

  const openDeleteDialog = (wishlist) => {
    setWishlistToDelete(wishlist);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setWishlistToDelete(null);
  };

  const handleOpenMenu = (event, wishlistId) => {
    setAnchorEl(event.currentTarget);
    setOpenMenuWishlistId(wishlistId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setOpenMenuWishlistId(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Your Wishlists</Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: colors.secondary.main,
            color: colors.getContrastText(colors.secondary.main),
            "&:hover": { backgroundColor: colors.secondary.dark },
          }}
          onClick={handleCreateWishlist}
        >
          Create Wishlist
        </Button>
      </Box>
      {wishlists.length === 0 ? (
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ textAlign: "center", marginTop: 4 }}
        >
          You do not have any wishlist, you may create one by using the "CREATE WISHLIST" button right above.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {wishlists.map((wishlist) => (
            <Grid item xs={12} sm={6} md={4} key={wishlist.wishlist_id}>
              <Card
                sx={{
                  backgroundColor: "background.paper",
                  color: "text.primary",
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6">{wishlist.name}</Typography>
                    <IconButton onClick={(event) => handleOpenMenu(event, wishlist.wishlist_id)}>
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
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
      )}

 
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
          <Button onClick={handleSubmitWishlist} variant="contained" color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>

    
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        PaperProps={{
          sx: {
            backgroundColor: 'background.paper',
            color: 'text.primary',
          }
        }}
      >
        <DialogTitle>Delete Wishlist</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.secondary' }}>
            Are you sure you want to delete the wishlist "{wishlistToDelete?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={closeDeleteDialog}
            variant="outlined"
            sx={{
              backgroundColor: colors.secondary.main,
              color: colors.getContrastText(colors.secondary.main),
              "&:hover": { backgroundColor: colors.secondary.dark },
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={() => handleDeleteWishlist(wishlistToDelete?.wishlist_id)} 
            color="error" 
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </ConfirmDialog>


      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={() => {
          openDeleteDialog(wishlists.find(w => w.wishlist_id === openMenuWishlistId));
          handleCloseMenu();
        }}>
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default WishlistPage;
