import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

const SearchResults = () => {
  const location = useLocation();
  const results = location.state?.results || []; // Default to an empty array if undefined
  const BACKEND_URL = 'http://127.0.0.1:8000';
  const [sortedResults, setSortedResults] = useState(results);
  const [sortCriteria, setSortCriteria] = useState(''); // Track selected sort option

  useEffect(() => {
    setSortedResults(results); // Update sortedResults when results change
  }, [results]);

  const getImageUrl = (imageUrl) => {    
    // imageUrl is the URL of the product image on the database which is something like : "images/dog-food.jpg"
    return `${BACKEND_URL}/static/${imageUrl}`;
  };
  
  // Sorting function
  const sortItems = (criteria) => {
    let sorted = [];
    if (criteria === 'price (ascending)') {
      sorted = [...results].sort((a, b) => a.price - b.price);
    } else if (criteria === 'price (descending)') {
      sorted = [...results].sort((a, b) => b.price - a.price);
    } else if (criteria === 'name (A-Z)') {
      sorted = [...results].sort((a, b) => a.name.localeCompare(b.name));
    } else if (criteria === 'name (Z-A)') {
      sorted = [...results].sort((a, b) => b.name.localeCompare(a.name));
    }
    setSortedResults(sorted);
    setSortCriteria(criteria);
  };

  return (
    <div className="container mt-4">
      <h2>Search Results</h2>

      {/* Sorting Options */}
      <div className="mb-3">
        <label htmlFor="sortOptions" className="form-label">Sort by:</label>
        <select
          id="sortOptions"
          className="form-select"
          value={sortCriteria}
          onChange={(e) => sortItems(e.target.value)}
        >
          <option value="">Select</option>
          <option value="price (ascending)">Price (Low to High)</option>
          <option value="price (descending)">Price (High to Low)</option>
          <option value="name (A-Z)">Name (A-Z)</option>
          <option value="name (Z-A)">Name (Z-A)</option>
        </select>
      </div>

      {sortedResults && sortedResults.length > 0 ? (
        <ul className="list-group">
          {sortedResults.map((result) => (
             <Link to={`/product-detail/${result.product_id}`} key={result.product_id} className="product-link">
             <li className="list-group-item">
             <img src={getImageUrl(result.image_url)} alt={result   .name} />
               <h5>{result.name}</h5>
               <p>{result.description}</p>
               <p><strong>Price:</strong> ${result.price}</p>
               <p><strong>Quantity:</strong> {result.quantity}</p>
             </li>
           </Link>
          ))}
        </ul>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default SearchResults;
