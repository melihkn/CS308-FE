// OrderItem.js

/*

Functionality of OrderItem component:
    - The OrderItem component is a functional component that displays the details of an item in an order.
    - It fetches the product details from the product listing service using the product ID.
    - It displays the product image, name, description, quantity, and purchase price of the item in the order.
    - It fetches the image from the authentication service mounted images but url is gotten from the product listing service.

*/
import React, { useEffect, useState } from "react";
import axios from "axios";

const OrderItem = ({ productId, quantity, purchase_price }) => {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8002/products/${productId}`);
        const productData = response.data;

        // Prefix the image URL
        const image_url_prefix = "http://127.0.0.1:8000/static/";
        const fullImageUrl = image_url_prefix + productData.image_url;
        setProduct({ ...productData, image_url: fullImageUrl });
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  if (!product) return <p>Loading product details...</p>;

  // in some orders, there might not be items, to avoid some errors
  const safePrice = purchase_price ?? 0; // Default to 0 if purchase_price is undefined or null

  return (
    <div style={{ display: "flex", marginBottom: "10px", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
      <img
        src={product.image_url}
        alt={product.name}
        style={{ width: "100px", height: "100px", marginRight: "20px", borderRadius: "5px" }}
      />
      <div>
        <h4 style={{ margin: 0 }}>{product.name}</h4>
        <p style={{ margin: 0, fontSize: "14px", color: "#555" }}>{product.description}</p>
        <p style={{ margin: "5px 0" }}>
          Quantity: {quantity} | Price at Purchase: ${safePrice.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default OrderItem;
