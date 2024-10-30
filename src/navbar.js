// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

/*
  In navbar, we do not do anything with the backend. We just display the navbar with the login and register links.

  Props:
    - isLoggedIn: boolean to check if the user is logged in or not
    - userProfile: user profile information such as email, name, surname, phone number (these are coming from the backend endpoint called /auth/status) 
    - onLogout: function to log out the user by removing the token from local storage. It is passed from AppContent.js

  Redirects:
    - Redirects to '/' after successful logout


  In jsx code:
    - if isLoggedIn is true, we display the user's email, profile link, and logout button.
    - if isLoggedIn is false, we display login and register links.

  These are the links that are displayed on the navbar. When the user clicks on these links, the user will be redirected to the corresponding pages.
*/

const Navbar = ({ isLoggedIn, userProfile, onLogout }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">MyVET</Link>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <span className="nav-link">Hello, {userProfile?.email}</span>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">Profile</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/cart">Shopping Cart</Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-link nav-link" onClick={onLogout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/cart">Shopping Cart</Link>
                </li>
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
