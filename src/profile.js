// Profile.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './profile.css';

const Profile = () => {
    const [profile, setProfile] = useState(null); // Holds profile data
    const navigate = useNavigate();

    // this useEffect hook is used to fetch the profile data from the server when the component mounts or when the navigate function changes
    useEffect(() => {
        // Read token from local storage of the browser
        const token = localStorage.getItem('token');

        // Redirect to login if no token is found
        if (!token) {
            navigate('/login'); 
            return;
        }
        // for users to see their profile, they need to login first.

        // Fetch profile data from the server by sending the token in the Authorization header which is tored in local storage of the browser
        // token is sent to backend in header of the request in the form of Bearer token (JWT token)
        axios.get('http://127.0.0.1:8000/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            setProfile(response.data); // Set profile data if successful
        })
        .catch(error => {
            console.error('Error fetching profile:', error);
            localStorage.removeItem('token'); // Clear token if invalid
            navigate('/login'); // Redirect to login
        });
    }, [navigate]);

    /*
    Followings jsx code does the following:
        If the profile data is available, it displays the profile information.
        If the profile data is not available, it displays a loading message.

        The profile data is displayed in a div element with the user's name, email, and phone number if available.
    */
    return (
         <div className="profile-container">
            {profile ? (
                 <div className="profile-card">
                    <h2 className="profile-heading">User Profile</h2>
                    <p className="profile-detail"><strong>Name:</strong> {profile.name} {profile.surname}</p>
                    <p className="profile-detail"><strong>Email:</strong> {profile.email}</p>
                    <p className="profile-detail"><strong>Phone:</strong> {profile.phone_number || 'N/A'}</p>
                </div>
            ) : (
                <p>Loading profile...</p>
            )}
        </div>
    );
};

export default Profile;
