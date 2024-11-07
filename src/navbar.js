import React, { useState } from 'react';
import axios from 'axios';
import { Link,useNavigate  } from 'react-router-dom';

/*
  In navbar, we do not do anything with the backend. We just display the navbar with the login and register links.

  Props:
    - isLoggedIn: boolean to check if the user is logged in or not
    - userProfile: user profile information such as email, name, surname, phone number 
      (these are coming from the backend endpoint called /auth/status)
    - onLogout: function to log out the user by removing the token from local storage. It is passed from AppContent.js
    - onSearch: function to handle the search query. It should be passed down to perform the search.

  Redirects:
    - Redirects to '/' after successful logout.

  In JSX code:
    - if isLoggedIn is true, we display the user's email, profile link, and logout button.
    - if isLoggedIn is false, we display login and register links.
    - A search bar is always displayed in the navbar.

  Links displayed on the navbar redirect the user to the corresponding pages.
*/

const Navbar = ({ isLoggedIn, userProfile, onLogout, onSearch }) => {
  // State to manage the search query input
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  // Handles the search form submission
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      // Make a POST request to the /search endpoint with the search query
      const response = await axios.post('http://127.0.0.1:8000/products/search', {
        query: searchQuery,
      });
      
    
      console.log('Search Results Retrieved:', response.data);
      // Navigate to search results page and pass the results
      navigate('/search-results', { state: { results: response.data } });
    } catch (error) {
      console.error('Error performing search:', error.response?.data || error.message);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">MyVET</Link>
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Search Bar */}
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <form className="d-flex" onSubmit={handleSearch}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="btn btn-outline-success ms-2" type="submit">Search</button>
              </form>
            </li>
          </ul>
          {/* User Links */}
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
