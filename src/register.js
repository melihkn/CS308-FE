// Register.js
import React, { useState } from 'react';
import axios from 'axios'; // axios is for sending http requests to the server in usually event handler functions
//import { Link } from 'react-router-dom'; // link is used to navigate to different pages like login and register in the navbar
import './register.css'; // Import your CSS file
import { useNavigate } from 'react-router-dom'; // import useNavigate hook to navigate to different pages

// Register component is a functional component that renders the registration form of the application.
const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    middlename: '',
    surname: '',
    email: '',
    password: '',
    phone_number: '',
  });

   // Initialize useNavigate hook to navigate to different pages
  const navigate = useNavigate();


  /*
  handleRegister function is used to handle the registration form submission.

  It takes an event object as a parameter which is used to prevent the default form submission. 
  It sends a post request to the server with the form data entered by the user -> register endpoint.

  Then, it displays the success message if the registration is successful on top of the web page. 
  */
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
        // it sends a post request to the server (running on host 127.0.0.1 and port 8000) with the form data entered by the user -> register endpoint
      const response = await axios.post('http://127.0.0.1:8000/register', formData);
        // response is the response from the server which can be a success message or an error message

      // Display success message on the top of the page as an google alert
      alert(response.data.message); 
      
      // navigate the user to home page after successful registration
      navigate('/'); 

    } catch (error) {
      // Display error message on the top of the page as an google alert
      alert(error.response.data.detail); 
      // if there is an error, the user stays on the same page but every field is cleared
      setFormData({
        name: '',
        middlename: '',
        surname: '',
        email: '',
        password: '',
        phone_number: '',
      });
    }
  };

  /*
  handleChange function is used to update the state of the form data when the user types in the input fields.

  It takes an event object as a parameter which contains the name and value of the input field that the user types in.
  */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

/*
    The following JSX code (a type of html code in JavaScript) is returned to render the registration form.
    It contains input fields for name, middle name, surname, email, password, and phone number.
    When the user submits the form, the handleRegister function is called.
    The handleChange function is called when the user types in the input fields.
    The value of the input fields is set to the corresponding values in the formData state.

*/
  return (
    <div className="container">
      <h2 className = "center-text-add-padding">Register</h2>
      <form onSubmit={handleRegister}>


        <div className="mb-3">
          <label>Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
          />
        </div>


        <div className="mb-3">
          <label>Middle Name (Optional)</label>
          <input
            type="text"
            name="middlename"
            className="form-control"
            value={formData.middlename}
            onChange={handleChange}
          />
        </div>


        <div className="mb-3">
          <label>Surname</label>
          <input
            type="text"
            name="surname"
            className="form-control"
            value={formData.surname}
            onChange={handleChange}
          />
        </div>


        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
          />
        </div>


        <div className="mb-3">
          <label>Phone Number (Optional)</label>
          <input
            type="text"
            name="phone_number"
            className="form-control"
            value={formData.phone_number}
            onChange={handleChange}
          />
        </div>

        <div className='button-div'>
        <button type="submit" className="btn btn-primary">Register</button>
        </div>

      </form>
    </div>
  );
};

export default Register;
