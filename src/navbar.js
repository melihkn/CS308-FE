// Navbar.js
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const [user, setUser] = useState(null); // Store user data
  const navigate = useNavigate();

  // Function to fetch user data when token is available
  const fetchUserData = useCallback(async (token) => {
    try {
      // Send a GET request to the server with the token in the Authorization header
      const response = await axios.get('http://127.0.0.1:8000/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // Store user data in state if request is successful
      setUser(response.data); 
      // Mark user as logged in
      setIsLoggedIn(true); 
    } 
    catch (error) {
      // Log error if there is one and log the user out
      console.error('Error fetching user data:', error);
      // Clear invalid token from storage
      localStorage.removeItem('token'); 
      // Mark user as logged out
      setIsLoggedIn(false); 
    }
  }, []);

  // Check for token on component mount or when token changes
  useEffect(() => {
    // Read token from storage
    const token = localStorage.getItem('token'); 
    if (token) {
      // Fetch user info if token is present in storage -> it returns the user data which is email of user
      fetchUserData(token); 
    }
    else {
      // If no token, user is logged out
      setIsLoggedIn(false); 
      setUser(null);
    }
  }, [fetchUserData]); // Rerun if `fetchUserData` changes

  // Handle logout
  const handleLogout = () => {
    // Remove token from storage
    localStorage.removeItem('token'); 
    // Mark user as logged out
    setIsLoggedIn(false); 
    // Clear user data
    setUser(null); 
    navigate('/'); // Redirect to homepage
  };

  /*
  Navbar component is a functional component that renders the navigation bar of the application. 

    It will be on top of every page of the application.

    First, there will be MyVET on the left side of the navigation bar. When we click MyVET, it will redirect to the home page.
      To do directing, in code we use href attribute of the anchor tag like:
        <a className="navbar-brand" href="/">MyVET</a>

    Then, there will be a button on the right side of the navigation bar.
    It contains two links: Login and Register. 
        When we click Login, it will redirect to the login page. 
        When we click Register, it will redirect to the register page.,
            For these two, we use Link component from react-router-dom. 

    Because of these routings, we need to import Link from react-router-dom.
  */

    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">MyVET</a>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {isLoggedIn ? (
                <>
                  <li className="nav-item">
                    <span className="nav-link">Hello, {user?.email}</span>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/profile">Profile</Link> 
                  </li>
                  <li className="nav-item">
                    <button className="btn btn-link nav-link" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/register">Register</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    );
};

export default Navbar;