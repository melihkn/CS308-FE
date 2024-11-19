// src/api.js

import axios from 'axios';
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

// Base URLs from environment variables
const PM_SERVICE_URL = "http://localhost:8003";

// Create Axios instances for each service
const pmService = axios.create({ baseURL: PM_SERVICE_URL });


const getToken = () => {
    return localStorage.getItem('token');
}

// Add the Authorization header with the Bearer token to every request
api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

pmService.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const fetchProducts = () => pmService.get('/ProductManager/products');
export const createProduct = (productData) => pmService.post('/ProductManager/products', productData);
export const fetchProduct = (id) => pmService.get(`/ProductManager/products/${id}`);
export const updateProduct = (id, data) => pmService.put(`/ProductManager/products/${id}`, data);
export const deleteProduct = async (product_id) => {
    try {
        const response = await pmService.delete(`ProductManager/products/${product_id}`);
        return response.data; // Adjust based on your API's delete response
    } catch (error) {
        console.error("Error deleting product:", error);
        throw error; // Throw error for handling in the calling function
    }
};

// Review APIs (Add approve/disapprove as needed)
export const fetchReview = (id) => pmService.get(`/ProductManager/reviews/${id}`);// Function to approve a review
export const approveReview = (id) => pmService.patch(`/ProductManager/reviews/${id}`, { approval_status: "approved" });

// Function to disapprove a review
export const disapproveReview = (id) => pmService.patch(`/ProductManager/reviews/${id}`, { approval_status: "disapproved" });
export const createReview = (data) => pmService.post('/ProductManager/reviews', data);
export const deleteReview = (id) => pmService.delete(`/ProductManager/reviews/${id}`);
export const fetchReviews = async (productId) => {
    try {
        const response = await pmService.get(`/ProductManager/reviews`, {
            params: { product_id: productId },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching reviews:", error);
        throw error;
    }
};
export const updateReview = (id, data) => pmService.put(`/ProductManager/reviews/${id}`, data);
// Category APIs
export const fetchCategory = (id) => pmService.get(`/categories/${id}`);
export const updateCategory = (id, data) => pmService.put(`/categories/${id}`, data);
export const deleteCategory = (id) => pmService.delete(`/categories/${id}`);
export const fetchCategories = () => pmService.get('/categories');
export const createCategory = (data) => pmService.post('/categories', data);
