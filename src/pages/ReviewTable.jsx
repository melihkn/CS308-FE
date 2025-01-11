import React, { useEffect, useState } from 'react';
import { fetchReviews, approveReview, disapproveReview } from '../api/api';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import { CardMedia } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import Header from '../components/Header';
import { tokens } from '../theme';
import { useTheme } from '@mui/material';
import { GridToolbar } from '@mui/x-data-grid';

const ReviewTable = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const response = await fetchReviews();
      console.log('Reviews:', response);
      const formattedReviews = response.map((review) => ({
        id: review.review_id, // Map review_id to id for DataGrid
        image_url: review.image_url, // Include image URL
        customer_name: review.customer_name, // Include customer name
        product_name: review.product_name, // Include product name
        rating: review.rating,
        comment: review.comment,
        approval_status: review.approval_status,
      }));
      console.log('Formatted reviews:', formattedReviews);
      setReviews(formattedReviews);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveReview(id);
      loadReviews();
    } catch (error) {
      console.error('Failed to approve review:', error);
    }
  };

  const handleDisapprove = async (id) => {
    try {
      await disapproveReview(id);
      loadReviews();
    } catch (error) {
      console.error('Failed to disapprove review:', error);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', flex: 1 },
    {
      field: "image_url",
      headerName: "Image",
      width: 100,
      renderCell: (params) => (
        <CardMedia
          component="img"
          sx={{ width: 50, height: 50, objectFit: "contain" }}
          image={`http://127.0.0.1:8001/static/${params.row.image_url}` || "/placeholder.svg"}
          //image={`${params.value}` || "/placeholder.svg"}
          alt={params.row.product_name}
        />
      ),
    },
    { field: 'customer_name', headerName: 'Customer Name', flex: 1.5 }, // Customer Name column
    { field: 'product_name', headerName: 'Product Name', flex: 1.5 }, // Product Name column
    { field: 'rating', headerName: 'Rating', flex: 1 },
    { field: 'comment', headerName: 'Comment', flex: 2 },
    { field: 'approval_status', headerName: 'Status', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box>
          <IconButton sx={{ color: '#868dfb' , mr:1}}
            onClick={() => handleApprove(params.row.id)}
          >
            <CheckCircleOutlineIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDisapprove(params.row.id)}
          >
            <CancelOutlinedIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
<Box m="20px">
      <Header title="Review Managements" subtitle="List of Review Requests" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
        }}
      >
        {loading ? (
          <Typography color="white">Loading...</Typography>
        ) : (
          <DataGrid
          rows={reviews}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          checkboxSelection
          disableSelectionOnClick
          components={{
            Toolbar: GridToolbar,
          }}
        />
        )}
      </Box>
    </Box>
  );
};

export default ReviewTable;
