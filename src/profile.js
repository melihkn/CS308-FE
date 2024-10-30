// Profile.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './profile.css';

/*  
    In profile component, we display the user's profile information such as name, surname, email, and phone number.
    If the user is not logged in, we redirect the user to the login page.

    Props:
        - isLoggedIn: boolean to check if the user is logged in or not
        - userProfile: user profile information such as email, name, surname, phone number (these are coming from the backend endpoint called /auth/status)

    Redirects:
        - Redirects to '/login' if the user is not logged in

    In jsx code:
        - if userProfile is available, we display the user's profile information.
        - if userProfile is not available, we display a loading message.
*/

const Profile = ({ isLoggedIn, userProfile }) => {
  const navigate = useNavigate();

  // Redirect to login if the user is not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  // Display profile information if userProfile is available
  return (
    <div className="profile-container">
      {userProfile ? (
        <div className="profile-card">
          <h2 className="profile-heading">User Profile</h2>
          <p className="profile-detail"><strong>Name:</strong> {userProfile.name} {userProfile.surname}</p>
          <p className="profile-detail"><strong>Email:</strong> {userProfile.email}</p>
          <p className="profile-detail"><strong>Phone:</strong> {userProfile.phone_number || 'N/A'}</p>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default Profile;
