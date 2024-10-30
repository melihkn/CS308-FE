// Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css';

/*
    Login component is a form that takes email and password as input.
    When the form is submitted, it sends a POST request to the server to authenticate the user.
    If the authentication is successful, it saves the JWT token coming from the backend to local storage and updates the login state in App.js.

    From now on, in AppContent.js, isLoggedIn state will be true and userProfile state will be updated with the user's profile information.
    
    Props:
        - onLogin: function to update the login state in App.js. It is passed from AppContent.js. It returns the login status, user id, and user profile information to AppContent.js.

    State:
        - email: input value for email
        - password: input value for password

    Redirects:
        - Redirects to '/' after successful login which is home page
*/

const Login = ({ onLogin }) => {
  // State variables
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Login function
  const handleLogin = async (e) => {
    // Prevent the default form submission behavior (refreshing the page)
    e.preventDefault();

    // Send a POST request to the server to authenticate the user with email and password
    try {
      const response = await axios.post('http://127.0.0.1:8000/login', { email, password });
      // Save the JWT token coming from the backend to local storage to keep the user logged in with the key 'token' 
      localStorage.setItem('token', response.data.access_token);

      // Send a GET request by passing the token in the header to the server to get the user's profile information (using the /auth/status endpoint)
      const profileResponse = await axios.get('http://127.0.0.1:8000/auth/status', {
        headers: { 'Authorization': `Bearer ${response.data.access_token}` }
      });

      // Update the login state in App.js with the login status, user id, and user profile information
      onLogin(true, profileResponse.data.userId, profileResponse.data);
      
      // Redirect to the home page after successful login and display an alert message to the user as google does
      alert('Login successful');
      navigate('/');

    }
    // Catch any error and display an alert message to the user
    catch (error) {
      alert(error.response?.data?.detail || 'Login failed');
    }
  };

  return (
    <div className="container">
      <h2 className="center-text">Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
};

export default Login;

