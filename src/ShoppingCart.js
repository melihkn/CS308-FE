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

/*
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ShoppingProductCard from './ShoppingProductCard';
import './ShoppingCart.css';

const BACKEND_URL = 'http://127.0.0.1:8001';


function ShoppingCart({ isLoggedIn, userId }) {
  const [basicCart, setBasicCart] = useState([]);       // Keeps product_id and quantity
  const [detailedCart, setDetailedCart] = useState([]); // Keeps full product details
  const [totalPrice, setTotalPrice] = useState(0);

  // Load the cart from either localStorage (non-logged-in) or backend (logged-in)
  useEffect(() => {
    const fetchBasicCart = async () => {
      if (isLoggedIn && userId) {
        try {
          // Fetch cart from backend for logged-in users
          const response = await axios.get(`${BACKEND_URL}/cart/${userId}`);
          setBasicCart(response.data.cart);
        } catch (error) {
          console.error("Error fetching cart from backend:", error);
        }
      } else {
        // Fetch cart from localStorage for non-logged-in users
        const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setBasicCart(storedCart);
      }
    };

    fetchBasicCart();
  }, [isLoggedIn, userId]);

  // Merge cart on login (only if there is a localStorage cart)
  useEffect(() => {
    const mergeLocalCartWithBackend = async () => {
      if (isLoggedIn && userId) {
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        if (localCart.length > 0) {
          try {
            await axios.post(`${BACKEND_URL}/cart/merge`, {
              items: localCart,
              customer_id: userId,
            });
            // Clear localStorage cart after merging
            localStorage.removeItem("cart");
            // Re-fetch the merged cart from the backend
            const response = await axios.get(`${BACKEND_URL}/cart/${userId}`);
            setBasicCart(response.data.cart);
          } catch (error) {
            console.error("Error merging local cart with backend:", error);
          }
        }
      }
    };

    mergeLocalCartWithBackend();
  }, [isLoggedIn, userId]);

  // Fetch detailed product info for each item in the basicCart
  useEffect(() => {
    const fetchDetailedCart = async () => {
      try {
        const detailedItems = await Promise.all(
          basicCart.map(async (item) => {
            const response = await axios.get(`${BACKEND_URL}/products/${item.product_id}`);
            return {
              ...response.data,
              quantity: item.quantity,
            };
          })
        );
        setDetailedCart(detailedItems);
      } catch (error) {
        console.error("Error fetching detailed product info:", error);
      }
    };

    if (basicCart.length > 0) {
      fetchDetailedCart();
    }
  }, [basicCart]);

  // Calculate total price based on detailedCart
  useEffect(() => {
    const calculateTotal = () => {
      const total = detailedCart.reduce((sum, item) => sum + (item.quantity * item.price || 0), 0);
      setTotalPrice(total);
    };
    calculateTotal();
  }, [detailedCart]);

  // Adjust item quantity in basicCart and backend/localStorage
  const adjustQuantity = async (productId, delta) => {
    // Find the product details for stock check
    const product = detailedCart.find((item) => item.product_id === productId);
    
    // Check stock before increasing quantity
    const currentQuantityInCart = basicCart.find(item => item.product_id === productId)?.quantity || 0;
    console.log(currentQuantityInCart)
    console.log(delta)
    console.log(product.quantity)
    if (delta > 0 && product && currentQuantityInCart + delta > product.quantity) {
      alert("Not enough stock available for this product.");
      return;
    }
    
    const updatedItems = basicCart.map(item =>
      item.product_id === productId ? { ...item, quantity: item.quantity + delta } : item
    ).filter(item => item.quantity > 0);

    setBasicCart(updatedItems);

    if (isLoggedIn && userId) {
      const endpoint = delta > 0 ? "increase_quantity" : "decrease_quantity";
      try {
        await axios.patch(`${BACKEND_URL}/cart/${endpoint}`, {
          product_id: productId,
          customer_id: userId,
        });
      } catch (error) {
        console.error(`Error ${delta > 0 ? "increasing" : "decreasing"} item quantity in backend:`, error);
      }
    } else {
      localStorage.setItem("cart", JSON.stringify(updatedItems));
    }
  };

  // Remove item from basicCart and backend/localStorage
  const removeFromCart = async (productId) => {
    const updatedItems = basicCart.filter(item => item.product_id !== productId);
    setBasicCart(updatedItems);

    if (isLoggedIn && userId) {
      try {
        await axios.delete(`${BACKEND_URL}/cart/remove`, {
          data: {
            product_id: productId,
            customer_id: userId,
          },
        });
      } catch (error) {
        console.error("Error removing item from cart in backend:", error);
      }
    } else {
      localStorage.setItem("cart", JSON.stringify(updatedItems));
    }
  };

  return (
    <div className="shopping-cart-container">
      <h2>{detailedCart.length > 0 ? "Shopping Cart" : "Shopping Cart is empty"}</h2>

      <div className="cart-items">
        {detailedCart.map(item => (
          <ShoppingProductCard
            key={item.product_id}
            name={item.name}
            model={item.model}
            description={item.description}
            quantity={item.quantity}
            distributor={item.distributor}
            imageUrl={item.image_url}
            price={item.price}
            onIncrease={() => adjustQuantity(item.product_id, 1)}
            onDecrease={() => adjustQuantity(item.product_id, -1)}
            onRemove={() => removeFromCart(item.product_id)}
          />
        ))}
      </div>
      <div className="cart-summary">
        <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
        <button onClick={() => alert("Redirect to checkout")}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default ShoppingCart;
*/

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ShoppingProductCard from './ShoppingProductCard';
import './ShoppingCart.css';

const BACKEND_URL = 'http://127.0.0.1:8001';

function ShoppingCart({ isLoggedIn, userId }) {
  const [basicCart, setBasicCart] = useState([]);
  const [detailedCart, setDetailedCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchBasicCart = async () => {
      if (isLoggedIn && userId) {
        try {
          const response = await axios.get(`${BACKEND_URL}/cart/${userId}`);
          setBasicCart(response.data.cart);
        } catch (error) {
          console.error("Error fetching cart from backend:", error);
        }
      } else {
        const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setBasicCart(storedCart);
      }
    };

    fetchBasicCart();
  }, [isLoggedIn, userId]);

  useEffect(() => {
    const mergeLocalCartWithBackend = async () => {
      if (isLoggedIn && userId) {
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        if (localCart.length > 0) {
          try {
            await axios.post(`${BACKEND_URL}/cart/merge`, {
              items: localCart,
              customer_id: userId,
            });
            localStorage.removeItem("cart");
            const response = await axios.get(`${BACKEND_URL}/cart/${userId}`);
            setBasicCart(response.data.cart);
          } catch (error) {
            console.error("Error merging local cart with backend:", error);
          }
        }
      }
    };

    mergeLocalCartWithBackend();
  }, [isLoggedIn, userId]);

  useEffect(() => {
    const fetchDetailedCart = async () => {
      try {
        const detailedItems = await Promise.all(
          basicCart.map(async (item) => {
            const response = await axios.get(`${BACKEND_URL}/products/${item.product_id}`);
            return { ...response.data, quantity: item.quantity };
          })
        );
        setDetailedCart(detailedItems);
      } catch (error) {
        console.error("Error fetching detailed product info:", error);
      }
    };

    if (basicCart.length > 0) {
      fetchDetailedCart();
    }
  }, [basicCart]);

  useEffect(() => {
    const calculateTotal = () => {
      const total = detailedCart.reduce((sum, item) => sum + (item.quantity * item.price || 0), 0);
      setTotalPrice(total);
    };
    calculateTotal();
  }, [detailedCart]);

  const adjustQuantity = async (productId, delta) => {
    const updatedItems = basicCart.map(item =>
      item.product_id === productId ? { ...item, quantity: item.quantity + delta } : item
    ).filter(item => item.quantity > 0);

    setBasicCart(updatedItems);

    if (isLoggedIn && userId) {
      const endpoint = delta > 0 ? "increase_quantity" : "decrease_quantity";
      try {
        await axios.patch(`${BACKEND_URL}/cart/${endpoint}`, {
          product_id: productId,
          customer_id: userId,
        });
      } catch (error) {
        console.error(`Error ${delta > 0 ? "increasing" : "decreasing"} item quantity in backend:`, error);
      }
    } else {
      localStorage.setItem("cart", JSON.stringify(updatedItems));
    }
  };

  const removeFromCart = async (productId) => {
    const updatedItems = basicCart.filter(item => item.product_id !== productId);
    setBasicCart(updatedItems);

    if (isLoggedIn && userId) {
      try {
        await axios.delete(`${BACKEND_URL}/cart/remove`, {
          data: { product_id: productId, customer_id: userId },
        });
      } catch (error) {
        console.error("Error removing item from cart in backend:", error);
      }
    } else {
      localStorage.setItem("cart", JSON.stringify(updatedItems));
    }
  };

  return (
    <div className="shopping-cart-container">
      <h2>{detailedCart.length > 0 ? "Shopping Cart" : "Shopping Cart is empty"}</h2>

      <div className="cart-items">
        {detailedCart.map(item => (
          <ShoppingProductCard
            key={item.product_id}
            name={item.name}
            model={item.model}
            description={item.description}
            quantity={item.quantity}
            distributor={item.distributor}
            imageUrl={item.image_url}
            price={item.price}
            onIncrease={() => adjustQuantity(item.product_id, 1)}
            onDecrease={() => adjustQuantity(item.product_id, -1)}
            onRemove={() => removeFromCart(item.product_id)}
          />
        ))}
      </div>
      <div className="cart-summary">
        <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
        <button onClick={() => alert("Redirect to checkout")}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default ShoppingCart;