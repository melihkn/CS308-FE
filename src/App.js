// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './navbar';
import Login from './login';
import Register from './register';
import HomePage from './HomePage';
import Profile from './profile';


// we need to route the login and register components to the '/' path 
// these components will be rendered when the user goes to the '/' path
// like the endpoints in the backend

// we need to establish proper routing in the app.js so that our app does have different pages that does different things (sending post and get request to our backend)

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Here are the routes. */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;

/* 
  Functionalities of the App:
    navbar is not a route. It is a component that is displayed on every page.
    http://localhost:3000/ will display the Home Page component
    http://localhost:3000/register will display the Register component
    http://localhost:3000/login will display the Login component

    We need to use Routes and Route components to map URLs to specific pages.
*/

// eğer kod çalışmazsa: export NODE_OPTIONS=--openssl-legacy-provider