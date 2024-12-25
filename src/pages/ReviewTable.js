import React, { useEffect, useState } from 'react';
import { fetchReviews, deleteReview, approveReview, disapproveReview } from '../api';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Typography,
    Paper,
    useTheme
} from '@mui/material';

import Header from '../components/Header';

import { DataGrid } from "@mui/x-data-grid";

import {tokens} from '../theme';

const ReviewTable = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true); // Yüklenme durumu

    useEffect(() => {
        loadReviews();
    }, []);

    const loadReviews = async () => {
        try {
            const response = await fetchReviews();
            const formattedReviews = response.map((review) => ({
                id: review.review_id,
                rating: review.rating,
                comment: review.comment,
                status: review.approval_status
            }));
            setLoading(false);
            setReviews(formattedReviews);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const handleApprove = async (id) => {
        try {
            await approveReview(id);
            console.log(`Review ${id} approved`);
            loadReviews();
        } catch (error) {
            console.error('Failed to approve review:', error);
        }
    };

    const handleDisapprove = async (id) => {
        try {
            await disapproveReview(id);
            console.log(`Review ${id} disapproved`);
            loadReviews();
        } catch (error) {
            console.error('Failed to disapprove review:', error);
        }
    };


    const columns = [
        { field: "id", headerName: "Product ID", flex: 1 },
        { field: "rating", headerName: "Rating", type: "number", flex: 1 },
        { field: "comment", headerName: "Comment", flex: 2 },
        { field: "status", headerName: "Status", flex: 1 },
        {
            field: "approve",
            headerName: "Approve",
            flex: 1,
            renderCell: (params) => (
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleApprove(params.row.id)}
              >
                Approve
              </Button>
            ),
          },
          {
            field: "dispprove",
            headerName: "Disapprove",
            flex: 1,
            renderCell: (params) => (
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleDisapprove(params.row.id)}
              >
                Disapprove
              </Button>
            ),
          },
    ]

 

    return (
        <Box m="20px">
          <Header title="Reviews" subtitle="List of Reviews" />
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
              <DataGrid rows={reviews} columns={columns} />
            )}
          </Box>
    
          
        </Box>
      );
};

export default ReviewTable;
