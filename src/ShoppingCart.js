// ShoppingCart.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import './ShoppingCart.css';

// ShoppingCart component (a type of function) displays the items in the shopping cart.
function ShoppingCart({ isLoggedIn, userId }) {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // this useEffect will be called when user logs in or logs out in each time the ShoppingCart component mounts (if no change in the isLoggedIn and userId, it will not run whether the component mounts or not)
  useEffect(() => {
    const fetchCartItems = async () => {
      // if the last of action of user is logging in, from now on, cartItems will be fetched from the backend using the appropriate endpoint
      if (isLoggedIn && userId) {
        try {
          // try to call the cart service of the backend to get the cart items of the user
          const response = await axios.get(`http://127.0.0.1:8001/cart/${userId}`);
          // then set the state variable cartItems to the cart items of the user
          setCartItems(response.data.cart);
        } 
        catch (error) {
          // if there is an error, catch the error and log it to the console
          console.error("Error fetching cart items:", error);
        }
      } 
      else {
        // if the last of action of user is logging out, from now on, cartItems will be fetched from the session storage which is clear because when user logged out, I clear the cart pbject in the local storage
        const storedCart = JSON.parse(sessionStorage.getItem("cart") || "[]");
        setCartItems(storedCart);
      }
    };
    // above local function will be called when the component mounts (in each navigation, it will run)
    fetchCartItems();
  }, [isLoggedIn, userId]);

  // Calculate total price
  useEffect(() => {
    // Defined local function to calculate the total price of the items in the cart and set the state variable totalPrice to the total price
    const calculateTotal = () => {
      const total = cartItems.reduce((sum, item) => sum + (item.quantity * item.price || 0), 0);
      setTotalPrice(total);
    };
    // this above local function will be called when the cartItems state variable changes in each time the ShoppingCart component mounts (if no change in the cartItems, it will not run whether the component mounts or not)
    calculateTotal();
  }, [cartItems]);

  
  // Adjust item quantity (increase or decrease)
  // jsx code bu fonksiyonu çağırıo ürün amount değişince - alttaki button lara tıklanınca (two options: 1 or -1)
  // bu fonksiyon cartItems state ini güncellio, aynı zamanda local storage daki yedek cart ı güncellio + backend e doğru endpoint e istek atıp ürünün cart daki sayısını değişio.
  const adjustQuantity = async (productId, delta) => {
    const updatedItems = cartItems.map(item =>
      item.product_id === productId ? { ...item, quantity: item.quantity + delta } : item
    ).filter(item => item.quantity > 0);

    setCartItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));

    if (isLoggedIn && userId) {
      const endpoint = delta > 0 ? "increase_quantity" : "decrease_quantity";
      try {
        await axios.patch(`http://127.0.0.1:8001/cart/${endpoint}`, {
          product_id: productId,
          customer_id: userId,
        });
      } catch (error) {
        console.error(`Error ${delta > 0 ? "increasing" : "decreasing"} item quantity:`, error);
      }
    }
  };


  // jsx code un da item in altındaki remove button ı tıklanınca bu fonksiyon çağrılıo product ın product id ile.
  // bu fonksiyon backend deki doğru endpoint e request atıp user ın cart dan bu itemi çıkarıo. 
  const removeFromCart = async (productId) => {
    const updatedItems = cartItems.filter(item => item.product_id !== productId);
    setCartItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));

    if (isLoggedIn && userId) {
      try {
        await axios.delete("http://127.0.0.1:8001/cart/remove", {
          data: {
            product_id: productId,
            customer_id: userId,
          },
        });
      } catch (error) {
        console.error("Error removing item from cart:", error);
      }
    }
  };


  // if the state of the isLoggedIn changes, the component will re-render and if the user now logged in, the local shopping cart will be merged with the persistent cart
  useEffect(() => {
    const mergeLocalCartWithPersistentCart = async () => {
      if (isLoggedIn && userId) {
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");

        if (localCart.length > 0) {
          // Send local cart items to backend for merging
          await axios.post(`http://127.0.0.1:8001/cart/merge`, {
            items: localCart,
            customer_id: userId,
          });

          // Clear local storage as it's now merged
          localStorage.removeItem("cart");

          // Fetch updated cart from backend
          const response = await axios.get(`http://127.0.0.1:8001/cart/${userId}`);
          setCartItems(response.data.cart);
        }
      }
    };

    mergeLocalCartWithPersistentCart();
  }, [isLoggedIn, userId]);

  return (
    <div className="shopping-cart-container">
      {/* Header based on cart items count */}
      <h2>{cartItems.length > 0 ? "Shopping Cart" : "Shopping Cart is empty"}</h2>

      <div className="cart-items">
        {cartItems.map(item => (
          <ProductCard
            key={item.product_id}
            name={item.name}
            model={item.model}
            description={item.description}
            quantity={item.quantity}
            distributor={item.distributor}
            imageUrl={item.image_url}
            onIncrease={() => adjustQuantity(item.product_id, 1)}
            onDecrease={() => adjustQuantity(item.product_id, -1)}
            onRemove={() => removeFromCart(item.product_id)}
          />
        ))}
      </div>
      <div className="cart-summary">
        <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
        {/* Redirect to checkout page -> TO DO LATER */}
        <button onClick={() => alert("Redirect to checkout")}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default ShoppingCart;
