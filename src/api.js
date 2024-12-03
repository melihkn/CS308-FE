// src/api.js

import axios from 'axios';
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

// Base URLs from environment variables
const PM_SERVICE_URL = "http://localhost:8003";

const PRODUCT_LIST_URL = "http://localhost:8002";

const REVIEWS_URL = "http://localhost:8031";

const reviewsService = axios.create({ baseURL: REVIEWS_URL });

const productsService = axios.create({ baseURL: PRODUCT_LIST_URL });    

// Create Axios instances for each service
const pmService = axios.create({ baseURL: PM_SERVICE_URL });


const getToken = () => {
    return localStorage.getItem('token');
}


// api.interceptors.request.use((config) => {
//     const token = getToken();
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

// Add the Authorization header with the Bearer token to every request of product manager
pmService.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/*reviewsService.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});*/

export const fetchProducts = async () => {
    try {
        const response = await pmService.get('/ProductManager/products');
        return response.data;
    }
    catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
}
    
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
export const deleteReview = async (id) =>  {
    try {
        const response = pmService.delete(`/ProductManager/reviews/${id}`)
        return response.data;
    }
    catch (error) {
        console.error("Error deleting review:", error);
        throw error;
    }
}
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

export const fetchProductbyId = async (data) => {
    console.log("Fetching product from:", `/products/${data}`); // Debugging
    try{
        const response = await productsService.get(`/products/${data}`) // Fetch product by ID
        console.log("Product fetched:", response.data); // Debugging    
        return response.data;
    } catch (error) {
        console.error("Error fetching product:", error.message);
        throw error; // Re-throw for higher-level handling
    };
}


export const addReview = async (reviewData) => {
    try {
        const token = localStorage.getItem("token"); // Retrieve the token from localStorage (or wherever you're storing it)

        if (!token) {
            throw new Error("Authentication token is missing");
        }

        console.log("Adding review:", reviewData); // Debugging
        const response = await reviewsService.post("/reviews/add_review", reviewData,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Add the Bearer token
                },
            }
        );
        console.log("Review added:", response.data); // Debugging
        return response.data; // Adjust based on your API's response
    } catch (error) {
        console.error("Error adding review:", error.message);
        throw error; // Re-throw for higher-level handling
    }
}


export const calculateOverallRating = async (reviews) => {
    try {
        const response = await reviewsService.get(`/reviews/calculate_rating`, reviews); // Calculate rating
        return response.data; // Adjust based on your API's response
    } catch (error) {
        console.error("Error calculating rating:", error.message);
        throw error; // Re-throw for higher-level handling
    }
}


export const fetchReviewsByProductId = async (product_id) => {
    try {
        console.log("Fetching reviews for product:", product_id); // Debugging
        const response = await reviewsService.get(`/reviews/get_reviews/${product_id}`); // Fetch reviews by product ID
        return response.data;
    } catch (error) {
        console.error("Error fetching reviews:", error);
        throw error;
    }
}

export const fetchAverageRating = async (product_id) => {
    try {
        console.log("Fetching average rating for product:", product_id); // Debugging
        const response = await reviewsService.get(`/reviews/calculate_rating/${product_id}`); // Fetch average rating by product ID
        return response.data;
    } catch (error) {
        console.error("Error fetching average rating:", error);
        throw error;
    }
}



  
