// HomePage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import './HomePage.css';


// THIS WILL CHANGE BECAUSE BACKEND HAS CHANGED
// THIS WILL CALL THE PRODUCTS SERVICE TO GET THE PRODUCTS TO BE DISPLAYED ON THE MAIN PAGE BASED ON POPULARIRTY OR ETC!!!!!!!

const HomePage = () => {
  // products state is used to store the list of products fetched from the backend
  const [products, setProducts] = useState([]);
  const BACKEND_URL = 'http://127.0.0.1:8001';

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
          <ProductCard 
            key={product.product_id}
            name={product.name}
            model={product.model}
            description={product.description}
            quantity={product.quantity}
            distributor={product.distributor}
            imageUrl={getImageUrl(product.image_url)}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
