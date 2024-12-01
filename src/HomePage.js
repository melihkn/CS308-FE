// HomePage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import './HomePage.css';


const HomePage = () => {
  // products state is used to store the list of products fetched from the backend
  const [products, setProducts] = useState([]);
  const BACKEND_URL = 'http://127.0.0.1:8002';

  // useEffect hook is used to fetch products from the backend when the component is mounted to the DOM (whenever, homepage is visited)
  useEffect(() => {
    // Fetch products from the backend by sending get request to /products endpoint which returns a list of products as json format
    const fetchProducts = async () => {
      try {
        // response is whole respıonse object, response.data is the data we get from the response which is a list of products each as dictionary object
        const response = await axios.get(`${BACKEND_URL}/products`);
        setProducts(response.data);
      } 
      catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);
  
  const getImageUrl = (imageUrl) => {    
      // imageUrl is the URL of the product image on the database which is something like : "images/dog-food.jpg"
      return `${BACKEND_URL}/static/${imageUrl}`;
    };

  return (
    <div className="homepage-container">
      <h1>Welcome to MyVet!</h1>
      <p>Your one-stop shop for all your pet needs.</p>
      {/* For each of the dictionary in the response.data which is each product, is displayed using ProductCards */}
      <div className="products-grid">
        {products.map(product => (
          <Link to={`/product-detail/${product.product_id}`} key={product.product_id} className="product-link">
          <div className="product-card">
            <img src={getImageUrl(product.image_url)} alt={product.name} />
            <h3>{product.name}</h3>
            <p><strong>Model:</strong> {product.model}</p>
            <p>{product.description}</p>
            <p><strong>Price:</strong> ${product.price}</p>
            <p><strong>Quantity:</strong> {product.quantity}</p>
          </div>
        </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
