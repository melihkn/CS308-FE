import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Slider,
  Button,
  Divider,
} from "@mui/material";
import StarRateIcon from "@mui/icons-material/StarRate";

function FiltersSearch({ filters, onFilterChange, onApplyFilters, onResetFilters }) {
  const handlePriceChange = (event, newValue) => {
    onFilterChange({ price_min: newValue[0], price_max: newValue[1] });
  };

  const handleRatingChange = (event, newValue) => {
    onFilterChange({ rating_min: newValue });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h6">Filters</Typography>
      <Divider />

      {/* Price Range Filter */}
      <Typography gutterBottom>Price Range</Typography>
      <Slider
        value={[filters.price_min || 0, filters.price_max || 1000]}
        onChange={handlePriceChange}
        valueLabelDisplay="auto"
        min={0}
        max={1000}
      />

      {/* Rating Filter */}
      <Typography gutterBottom>Minimum Rating</Typography>
      <Slider
        value={filters.rating_min || 0}
        onChange={handleRatingChange}
        valueLabelDisplay="auto"
        step={1}
        marks
        min={0}
        max={5}
        sx={{ "& .MuiSlider-markLabel": { display: "flex", alignItems: "center" } }}
        valueLabelFormat={(value) => (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {Array.from({ length: value }, (_, i) => (
              <StarRateIcon key={i} fontSize="small" color="primary" />
            ))}
          </Box>
        )}
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
