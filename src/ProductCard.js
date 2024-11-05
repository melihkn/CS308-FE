// ProductCard.js
import React from 'react';
import './ProductCard.css';

/*
    ProductCard component displays product information.
    Props:
        - name, model, description, quantity, distributor, imageUrl
        - onIncrease, onDecrease, onRemove: Optional functions for cart actions.
*/

// this will be used in HomePage.js and ShoppingCart.js
const ProductCard = ({ 
  name, 
  model, 
  description, 
  quantity, 
  distributor, 
  imageUrl, 
  onIncrease, 
  onDecrease, 
  onRemove 
}) => {
  return (
    <div className="product-card">
      <img src={imageUrl} alt={name} className="product-image" />
      <div className="product-info">
        <h3>{name}</h3>
        <p><strong>Model:</strong> {model}</p>
        <p>{description}</p>
        <p><strong>Quantity:</strong> {quantity}</p>
        <p><strong>Distributor:</strong> {distributor}</p>
        <div className="cart-actions">
          {onDecrease && <button onClick={onDecrease}>-</button>}
          {onIncrease && <button onClick={onIncrease}>+</button>}
          {onRemove && <button onClick={onRemove}>Remove</button>}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
