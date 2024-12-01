import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProductDetail = () => {
  const { productId } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null); // State for category information

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8002/products/${productId}`);
        setProduct(response.data);

        // Fetch category info based on the product's category_id
        if (response.data.category_id) {
          const categoryResponse = await axios.get(
            `http://127.0.0.1:8002/products/${productId}/category`
          );
          setCategory(categoryResponse.data);
        }
      } catch (error) {
        console.error("Error fetching product or category details:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>{product.name}</h2>
      <img
        src={`http://127.0.0.1:8002/static/${product.image_url}`}
        alt={product.name}
        style={{ maxWidth: "400px" }}
      />
      <p><strong>Model:</strong> {product.model}</p>
      <p><strong>Description:</strong> {product.description}</p>
      <p><strong>Price:</strong> ${product.price}</p>
      <p><strong>Quantity:</strong> {product.quantity}</p>
      <p><strong>Distributor:</strong> {product.distributor}</p>
      <p><strong>Warranty Status:</strong> {product.warranty_status} months</p>

      {category ? (
        <div>
          <h3>Category Information</h3>
          <p><strong>Category Name:</strong> {category.category_name}</p>
          {category.parent_category_id && (
            <p><strong>Parent Category ID:</strong> {category.parent_category_id}</p>
          )}
        </div>
      ) : (
        <p>Category information is not available.</p>
      )}
    </div>
  );
};

export default ProductDetail;
