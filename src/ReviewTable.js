// src/components/ReviewTable.js

import React, { useEffect, useState } from 'react';
import { fetchReviews, deleteReview, approveReview, disapproveReview } from './api'; // API calls for reviews
import './Table.css';

const ReviewTable = () => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        loadReviews();
    }, []);

    const loadReviews = async () => {
        try {
            const response = await fetchReviews();
            setReviews(response);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        }
    };

    const handleApprove = async (id) => {
        try {
            await approveReview(id);
            console.log(`Review ${id} approved`);
            loadReviews(); // Reload reviews to reflect status change
        } catch (error) {
            console.error("Failed to approve review:", error);
        }
    };

    const handleDisapprove = async (id) => {
        try {
            await disapproveReview(id);
            console.log(`Review ${id} disapproved`);
            loadReviews(); // Reload reviews to reflect status change
        } catch (error) {
            console.error("Failed to disapprove review:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteReview(id);
            console.log(`Review ${id} deleted`);
            setReviews(reviews.filter((review) => review.review_id !== id)); // Remove from state
        } catch (error) {
            console.error("Failed to delete review:", error);
        }
    };

    return (
        <div className="review-table-container">
            <h2>Reviews List</h2>
            <table className="review-table">
                <thead>
                    <tr>
                        <th>Product ID</th>
                        <th>Rating</th>
                        <th>Comment</th>
                        <th>Approval Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {reviews.map((review) => (
                        <tr key={review.review_id}>
                            <td>{review.product_id}</td>
                            <td>{review.rating}</td>
                            <td>{review.comment}</td>
                            <td>{review.approval_status}</td>
                            <td>
                                <button onClick={() => handleApprove(review.review_id)}>Approve</button>
                                <button onClick={() => handleDisapprove(review.review_id)}>Disapprove</button>
                                <button onClick={() => handleDelete(review.review_id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReviewTable;
