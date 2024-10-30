// ShoppingCart.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ShoppingCart.css';

/*
  ShoppingCart component displays the items in the shopping cart.
  If the user is logged in, it saves the items to the backend cart.
  If the user is not logged in, it saves the items to the session storage cart temporarily.
    - key is cart and value is an array (actually a dictionary -> item and count) of objects with productId and quantity properties.


  Props:
    - isLoggedIn: boolean to check if the user is logged in or not
    - userId: user id of the logged-in user (coming from the backend endpoint called /auth/status)

  State:
    - cartItems: array of objects with productId and quantity properties

  Functions:
    - addToCart: function to add an item to the cart
      - If the user is logged in, add the item to the backend cart
      - If the user is not logged in, add the item to the session storage cart

  Side Effects:
    - Load the items from the session storage cart when the component mounts

  In jsx code:
    - Display the items in the cart
    - Display a button to add an example product to the cart
    - Display a message to inform the user about the cart saving method
*/

function ShoppingCart({ isLoggedIn, userId }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = async (productId, quantity) => {

    // If the user is logged in, add the item to the backend cart
    if (isLoggedIn && userId) {
      try {
        // Send a POST request to the server to add the item to the cart
        await axios.post("http://127.0.0.1:8000/cart/add", {
          product_id: productId,
          quantity: quantity,
          customer_id: userId,
        });
        console.log("Item added to backend cart.");
      } 
      catch (error) {
        console.error("Error adding item to backend cart:", error);
      }
    } 
    // If the user is not logged in, add the item to the session storage cart
    else {
      // Get the cart from the session storage or create an empty cart
      let cart = JSON.parse(sessionStorage.getItem("cart") || "[]");
      // Find the index of the existing item in the cart
      const existingItemIndex = cart.findIndex(item => item.productId === productId);
      // If the item exists in the cart, increase the quantity
      if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += quantity;
      }
      // If the item does not exist in the cart, add a new item 
      else {
        cart.push({ productId, quantity });
      }
      // Save the updated cart to the session storage
      sessionStorage.setItem("cart", JSON.stringify(cart));
      // Update the cart items state with the updated cart
      setCartItems(cart);
    }
  };

  // Load the items from the session storage cart when the component mounts (ShoppingCart component is rendered)
  useEffect(() => {
    // Get the cart from the session storage or create an empty cart
    const storedCart = JSON.parse(sessionStorage.getItem("cart") || "[]");
    // Update the cart items state with the stored cart
    setCartItems(storedCart);
  }, []);

  
  return (
    <div className='ShoppingCartMain'>
      <h2>Shopping Cart</h2>
      {/* Display the items in the cart as unordered*/}
      <ul>
        {cartItems.map((item, index) => (
          <li key={index}>
            Product ID: {item.productId}, Quantity: {item.quantity}
          </li>
        ))}
      </ul>
      {/* Button to add an example product to the cart */}
      <button className='add-to-cart-button' onClick={() => addToCart("example-product-id", 1)}>Add Example Product</button>
      {isLoggedIn ? <p className='cart-message'>Your items are saved to your account's cart.</p> : <p className='cart-message'>Your items are saved temporarily for this session.</p>}
    </div>
  );
}

export default ShoppingCart;

