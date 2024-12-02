import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { Grid } from '@mui/material';

const SearchResults = ({userId, isLoggedIn}) => {
  const location = useLocation();
  const results = location.state?.results || []; // Default to an empty array if undefined
  const BACKEND_URL = 'http://127.0.0.1:8002';
  const [sortedResults, setSortedResults] = useState(results);
  const [sortCriteria, setSortCriteria] = useState(''); // Track selected sort option

  useEffect(() => {
    setSortedResults(results); // Update sortedResults when results change
  }, [results]);

  const getImageUrl = (imageUrl) => {
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
    } else if (criteria === 'popularity') {
      sorted = [...results].sort((a, b) => b.item_sold - a.item_sold); // Sort by item_sold in descending order
    }
    setSortedResults(sorted);
    setSortCriteria(criteria);
  };

  return (
    <div style={{ margin: '20px' }}>
      <h2>Search Results</h2>

      {/* Sorting Options */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="sortOptions" style={{ marginRight: '10px', fontWeight: 'bold' }}>
          Sort by:
        </label>
        <select
          id="sortOptions"
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontSize: '16px',
          }}
          value={sortCriteria}
          onChange={(e) => sortItems(e.target.value)}
        >
          <option value="">Select</option>
          <option value="price (ascending)">Price (Low to High)</option>
          <option value="price (descending)">Price (High to Low)</option>
          <option value="name (A-Z)">Name (A-Z)</option>
          <option value="name (Z-A)">Name (Z-A)</option>
          <option value="popularity">Popularity (Most Sold)</option> {/* New Option */}
        </select>
      </div>

      {sortedResults && sortedResults.length > 0 ? (
        <div
        
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
          }}
        >
          {sortedResults.map((result) => (
            <Grid item key={result.product_id} xs={12} sm={6} md={4}>
            <ProductCard
              userId={userId}
              isLoggedIn={isLoggedIn}
              id={result.product_id}
              name={result.name}
              model={result.model}
              description={result.description}
              quantity={result.quantity}
              distributor={result.distributor}
              imageUrl={getImageUrl(result.image_url)}
            />
            </Grid>
          ))}
        </div>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default SearchResults;
