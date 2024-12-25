import React, { useEffect, useState } from 'react';
import { fetchReviews, approveReview, disapproveReview } from './api';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

const ReviewTable = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const response = await fetchReviews();
      console.log('Reviews:', response);
      const formattedReviews = response.map((review) => ({
        id: review.review_id, // Map review_id to id for DataGrid
        customer_name: review.customer_name, // Include customer name
        product_name: review.product_name, // Include product name
        rating: review.rating,
        comment: review.comment,
        approval_status: review.approval_status,
      }));
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
          <IconButton
            color="success"
            onClick={() => handleApprove(params.row.id)}
            sx={{ mr: 1 }}
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
    <Box sx={{ width: '100%', height: 500 }}>
      <DataGrid
        rows={reviews}
        columns={columns}
        loading={loading}
        pageSize={10}
        rowsPerPageOptions={[10, 20, 50]}
        disableSelectionOnClick
      />
    </Box>
  );
};

export default ReviewTable;
