// AppContent.js
import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import Login from './login';
import Register from './register';
import HomePage from './HomePage';
import Profile from './profile';
import ShoppingCart from './ShoppingCart';
import axios from 'axios';
import ProductManagerDashboard from './ProductManagerDashboard';
import ProductDetailPage from './ProductDetailPage';

/*
  Created a functional component named AppContent because useNavigate hook must be used within a component that is rendered inside a Router.

  In AppContent component:
    - We have a state variable isLoggedIn to keep track of the user's login status.
    - We have a state variable userId to keep track of the user's id.
    - We have a state variable userProfile to keep track of the user's profile information. (like email, name, surname, phone number),
    - We have a function handleLogin to update the login status, user id, and user profile information to be passed to the child componnent Login.
    - We have a function handleLogout to remove the token from local storage and update the login status, user id, and user profile information.
    - We have a useEffect hook to check the login status when the component mounts.
    - We have a Routes component to define the routes in the application.
    - We have Route components to map URLs to specific pages. 


  In jsx code:
    - We have a Navbar component to display the navbar on every page.
    - We have Route components to map URLs to specific pages.
    - We have a HomePage component to display the home page.
    - We have a Login component to display the login page.
    - We have a Register component to display the register page.
    - We have a Profile component to display the user's profile information.
    - We have a ShoppingCart component to display the items in the shopping cart.
*/

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();

  // this useEffect hook will run when the component mounts (in each navigation, it will run)
  useEffect(() => {

    // checkLoginStatus function is defined to check the login status of the user
    const checkLoginStatus = async () => {
      // take the token from the local storage of the web browser
      const token = localStorage.getItem('token');
      
      // if there is no token, set the isLoggedIn state to false and set the userProfile state to null and return
      if (!token) {
        setIsLoggedIn(false);
        setUserProfile(null);
        return;
      }

      // if there is a token, send a GET request to the server to check the token and get the user's profile information (using the /auth/status endpoint)
      try {
        // response contains the user's profile information such as email, name, surname, phone number
        const response = await axios.get('http://127.0.0.1:8000/auth/status', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        // if the response is successful, set the isLoggedIn state to true, set the userId state to the user's id, and set the userProfile state to the user's profile information
        setIsLoggedIn(true);
        setUserId(response.data.userId);
        setUserProfile(response.data);
      } 
      // if there is an error, catch the error, remove the token from the local storage, set the isLoggedIn state to false, set the userProfile state to null, and redirect the user to the login page
      catch (error) {
        console.error('Error validating token:', error);
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUserProfile(null);
        navigate('/login');
      }
    };

    // call the local function checkLoginStatus to check the login status of the user when the component mounts (in each navigation, it will run)
    checkLoginStatus();
  }, [navigate]);

  // handleLogin function is defined to update the login status, user id, and user profile information to be passed to the child componnent Login
  const handleLogin = (loggedIn, id, profileData) => {
    setIsLoggedIn(loggedIn);
    setUserId(id);
    setUserProfile(profileData);
  };

  // handleLogout function is defined to remove the token from local storage and update the login status, user id, and user profile information
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserId(null);
    setUserProfile(null);
    // redirect the user to the home page after successful logout
    navigate('/');
  };

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} userProfile={userProfile} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile isLoggedIn={isLoggedIn} userProfile={userProfile} />} />
        <Route path="/cart" element={<ShoppingCart isLoggedIn={isLoggedIn} userId={userId} />} />
        {/* Protected route for Product Manager Dashboard */}
        {isLoggedIn && userProfile?.role === 'product_manager' && (
          <Route path="/dashboards/ProductManager/*" element={<ProductManagerDashboard />} />
        )}
        <Route path="/product/:id" element={<ProductDetailPage isLoggedIn={isLoggedIn} userId={userId}/>} />
      </Routes>
    </>
  );
}

export default AppContent;

/* 
  Functionalities of the App:
    navbar is not a route. It is a component that is displayed on every page.
    http://localhost:3000/ will display the Home Page component
    http://localhost:3000/register will display the Register component
    http://localhost:3000/login will display the Login component

    We need to use Routes and Route components to map URLs to specific pages.
*/