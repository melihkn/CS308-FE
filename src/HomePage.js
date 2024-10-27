// HomePage.js
import React from "react";
//import PopularItem from './PopularItem'; // Import the PopularItem component
import './HomePage.css'; // Import the CSS file for the HomePage component


// note: navbar is automatically displayed on top of it because it is in the app.js file top. In app, we direct to this file.
const HomePage = () => {
  // Sample data for popular items
  const popularItems = [
    { id: 1, name: 'Dog Food', price: '$25', imageUrl: 'path/to/image1.jpg' },
    { id: 2, name: 'Cat Litter', price: '$15', imageUrl: 'path/to/image2.jpg' },
    { id: 3, name: 'Dog Toy', price: '$10', imageUrl: 'path/to/image3.jpg' },
    { id: 4, name: 'Cat Bed', price: '$40', imageUrl: 'path/to/image4.jpg' },
  ];


  /* 
  Popular items data will be displayed in the HomePage component. But we need to have PopularItem component to display each item.

  <div className="row">
        {
        popularItems.map(item => (
          <div className="col-md-3 mb-4" key={item.id}>
            <PopularItem item={item} />
          </div>
        ))
        }
  </div>
  */

  return (
    <div className="container text-center">
      <h1>Welcome to MyVet!</h1>
      <p>Your one-stop shop for all your pet needs.</p>
      
      <h2>Popular Items</h2>

      

    </div>
  );
};

export default HomePage;
