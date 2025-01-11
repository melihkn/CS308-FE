import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Checkbox,
  FormControlLabel,
  Typography,
  Box,
  Divider,
  Button,
  Rating,
  TextField
} from "@mui/material";

function Filters({ filters, subcategories, onFilterChange, onApplyFilters, onResetFilters }) {
  const handleSubCategoryChange = (event) => {
    onFilterChange({ sub_category: Number(event.target.value) });
  };

  const handlePriceChange = (event, newValue) => {
    onFilterChange({ price_min: newValue[0], price_max: newValue[1] });
  };

  const handleRatingChange = (event, newValue) => {
    onFilterChange({ rating_min: newValue });
  };

  const handleWarrantyChange = (event) => {
    onFilterChange({ warranty_status: Number(event.target.value) });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h6">Filters</Typography>
      <Divider />

      {/* Subcategories Filter */}
      <FormControl fullWidth>
        <InputLabel id="subcategory-label">Subcategories</InputLabel>
        <Select
          labelId="subcategory-label"
          value={filters.sub_category || ""}
          onChange={handleSubCategoryChange}
        >
          <MenuItem value="0">All</MenuItem>
          {subcategories.map((sub) => (
            <MenuItem key={sub.category_id} value={sub.category_id}>
              {sub.category_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Price Filter (Slider) */}
      <Box sx={{ px: 2 }}>
        <Typography gutterBottom>Price Range</Typography>
        <Slider
          value={[filters.price_min || 0, filters.price_max || 1000]}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={100}
          step={3}
        />
      </Box>

      {/* Rating Filter (Stars) */}
      <Box sx={{ px: 2 }}>
        <Typography gutterBottom>Minimum Rating</Typography>
        <Rating
          name="rating-filter"
          value={filters.rating_min || 0}
          onChange={handleRatingChange}
          precision={1}
        />
      </Box>

        {/* Warranty Filter */}
        <TextField
          label="Min Warranty"
          type="number"
          value={filters.warranty_status || ""}
          onChange={handleWarrantyChange}
          fullWidth
        />

      <Divider />

      {/* Buttons */}
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
        <Button variant="contained" color="primary" onClick={onApplyFilters}>
          Apply Filters
        </Button>
        <Button variant="outlined" color="secondary" onClick={onResetFilters}>
          Retake Changes
        </Button>
      </Box>
    </Box>
  );
}

export default Filters;

