// ProductCard.js
import React from 'react';
import './ProductCard.css';

/*
    ProductCard component is a reusable component that displays information about a product.
    It takes the following props:
        - name: name of the product
        - model: model of the product
        - description: description of the product
        - quantity: quantity of the product
        - distributor: distributor of the product
        - imageUrl: URL of the product image

    Example usage:
    <ProductCard 
        name="Dog Food"
        model="1234"
        description="A healthy dog food for your furry friend."
        quantity={10}
        distributor="PetCo"
        imageUrl="https://example.com/dog-food.jpg"
    />

    These info will be coming from the endpoint in the backend called /products which returns a list of products as json format.
    Each product in the list is a dictionary object with the following keys: 
        - product_id, name, model, description, quantity, distributor, image_url
        - image_url is the URL of the product image on the server 

*/

const ProductCard = ({ name, model, description, quantity, distributor, imageUrl }) => {
  return (
    <div className="product-card">
      <img src={imageUrl} alt={name} className="product-image" />
      <div className="product-info">
        <h3>{name}</h3>
        <p><strong>Model:</strong> {model}</p>
        <p>{description}</p>
        <p><strong>Quantity:</strong> {quantity}</p>
        <p><strong>Distributor:</strong> {distributor}</p>
      </div>
    </div>
  );
};

export default ProductCard;
