import React from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  Rating,
  Slider,
} from "@mui/material";

function FiltersSearch({ filters, onFilterChange, onApplyFilters, onResetFilters }) {
  const handlePriceChange = (event, newValue) => {
    onFilterChange({ price_min: newValue[0], price_max: newValue[1] });
  };

  const handleRatingChange = (event, newValue) => {
    if (newValue !== null) {
      onFilterChange({ rating_min: newValue });
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h6">Filters</Typography>
      <Divider />

      {/* Price Range Filter */}
      <Typography gutterBottom>Price Range</Typography>
      <Slider
        value={[filters.price_min || 0, filters.price_max || 1500]}
        onChange={handlePriceChange}
        valueLabelDisplay="auto"
        min={0}
        max={1500}
      />

      {/* Rating Filter */}
      <Typography gutterBottom>Minimum Rating</Typography>
      <Rating
        name="rating-filter"
        value={filters.rating_min || 0}
        onChange={handleRatingChange}
        precision={1} // Allows selection of whole numbers only
      />

      <Divider />

      {/* Buttons */}
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
        <Button variant="contained" color="primary" onClick={onApplyFilters}>
          Apply Filters
        </Button>
        <Button variant="outlined" color="secondary" onClick={onResetFilters}>
          Reset Filters
        </Button>
      </Box>
    </Box>
  );
}

export default FiltersSearch;
