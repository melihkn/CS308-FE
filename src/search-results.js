import React from 'react';
import { useLocation } from 'react-router-dom';

const SearchResults = () => {
  const location = useLocation();
  const results = location.state?.results || []; // Handle undefined state gracefully
  
  console.log("Search Results in Component:", results); // Debug
  
  return (
    <div className="container mt-4">
      <h2>Search Results</h2>
      {results.length > 0 ? (
        <ul className="list-group">
          {results.map((result, index) => (
            <li key={result.product_id} className="list-group-item">
              <h5>{result.name}</h5>
              
              <p>{result.description}</p>
              <p><strong>Price:</strong> ${result.price}</p>
              <p><strong>Quantity:</strong> {result.quantity}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};




export default SearchResults;
