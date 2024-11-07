// HomePage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import './HomePage.css';


// backend url of the server in which images are kept (static file)
const BACKEND_URL = 'http://127.0.0.1:8001';

// we display all the products in the homepage (for now, then we display the most popular items in the home page)
const HomePage = () => {
  // products state is used to store the list of products fetched from the backend
  const [products, setProducts] = useState([]);

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
  
  // note: we pass the relative url of the image to the ProductCard component and the ProductCard component will convert it to the full url
  
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
            imageUrl={product.image_url}
            price={product.price}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
