// Login.js
import React, { useState } from 'react';
import axios from 'axios'; // axios is for sending http requests to the server (endpoints in the backend)
import { useNavigate } from 'react-router-dom'; // import useNavigate hook to navigate to different pages
import './login.css'; // Import CSS for styling


const Login = () => {
  // // State variables for email and password with initial values of empty strings
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // // after this, we can change the value of email and password using setEmail and setPassword functions in jsx code for example (yani burda variable ları ve update fonksiyonlarını tanımlammış olduk)

  // Initialize useNavigate hook to navigate to different pages
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    // Prevent default form submission behavior (refreshing the page)
    e.preventDefault();

    try {
      // Send a POST request to the server with the email and password entered by the user
      // endpoint returns an object with a JSON BODY. The object (response of backend) contains a key named access_token which is the JWT token 
      // access_token is the key of the token returned from the backend
      const response = await axios.post('http://127.0.0.1:8000/login', { email, password });
      // Save JWT token to local storage
      localStorage.setItem('token', response.data.access_token); 
      // Display success message on the top of the page as an alert 
      alert('Login successful');
      // If successful login, redirect to the home page
      navigate('/');
      // Reload the page to reflect the login state
      window.location.reload();
    } 
    // If there is an error, display the error message
    catch (error) {
      alert(error.response?.data?.detail || 'Login failed');
    }
  };

  /*
  The following JSX code is returned to render the login form.

      It contains input fields for email and password.
      The value of the input fields is set to the corresponding values in the email and password state. 
      This is done using the value attribute of the input fields and onChange event handler to update the state when the user types in the input fields.
  
      Then, When the user submits the form, the handleLogin function is called.
  */

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
