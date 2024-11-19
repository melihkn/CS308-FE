// src/components/ReviewForm.js

import React, { useState, useEffect } from 'react';
import { createReview, updateReview } from './api'; // API calls for reviews

const ReviewForm = ({ review = {}, onClose }) => {
    const [productId, setProductId] = useState('');
    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState('');
    const [approvalStatus, setApprovalStatus] = useState('');

    useEffect(() => {
        setProductId(review.product_id || '');
        setRating(review.rating || 1);
        setComment(review.comment || '');
        setApprovalStatus(review.approval_status || '');
    }, [review]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const reviewData = {
            product_id: productId,
            rating: parseInt(rating, 10),
            ...(comment && { comment }),
            ...(approvalStatus && { approval_status: approvalStatus }),
        };

        try {
            if (review.review_id) {
                await updateReview(review.review_id, reviewData)
                alert("Review Updated Successfully");
            } else {
                await createReview(reviewData);
                alert("Review Created Successfully");
            }
            onClose();
        } catch (error) {
            console.error("Error saving review:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Product ID:</label>
                <input type="text" value={productId} onChange={(e) => setProductId(e.target.value)} required />
            </div>
            <div>
                <label>Rating:</label>
                <input type="number" value={rating} onChange={(e) => setRating(e.target.value)} min="1" max="5" required />
            </div>
            <div>
                <label>Comment:</label>
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
            </div>
            <div>
                <label>Approval Status:</label>
                <input type="text" value={approvalStatus} onChange={(e) => setApprovalStatus(e.target.value)} />
            </div>
            <button type="submit">{review.review_id ? 'Update' : 'Create'} Review</button>
        </form>
    );
};

export default ReviewForm;
