import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Checkbox,
  FormControlLabel,
  Typography,
  Box,
  Divider,
  Button,
} from "@mui/material";

function Filters({ filters, subcategories, onFilterChange, onApplyFilters, onResetFilters }) {
  const handleSubCategoryChange = (event) => {
    onFilterChange({ sub_category: Number(event.target.value) });
  };

  const handlePriceMinChange = (event) => {
    onFilterChange({ price_min: Number(event.target.value) });
  };

  const handlePriceMaxChange = (event) => {
    onFilterChange({ price_max: Number(event.target.value) });
  };

  const handleRatingChange = (event) => {
    onFilterChange({ rating_min: Number(event.target.value) });
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
          <MenuItem value="">All</MenuItem>
          {subcategories.map((sub) => (
            <MenuItem key={sub.category_id} value={sub.category_id}>
              {sub.category_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Price Min Filter */}
      <TextField
        label="Min Price"
        type="number"
        value={filters.price_min || ""}
        onChange={handlePriceMinChange}
        fullWidth
      />

      {/* Price Max Filter */}
      <TextField
        label="Max Price"
        type="number"
        value={filters.price_max || ""}
        onChange={handlePriceMaxChange}
        fullWidth
      />

      {/* Rating Filter */}
      <FormControl fullWidth>
        <InputLabel id="rating-label">Rating</InputLabel>
        <Select
          labelId="rating-label"
          value={filters.rating_min || ""}
          onChange={handleRatingChange}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value={1}>1 & up</MenuItem>
          <MenuItem value={2}>2 & up</MenuItem>
          <MenuItem value={3}>3 & up</MenuItem>
          <MenuItem value={4}>4 & up</MenuItem>
          <MenuItem value={5}>5</MenuItem>
        </Select>
      </FormControl>

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
