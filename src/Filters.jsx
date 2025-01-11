import React from "react";
import {
  Checkbox,
  FormControlLabel,
  Typography,
  Box,
  Divider,
  Button,
  Slider,
  Rating,
  TextField,
} from "@mui/material";
import {useTheme} from "@mui/material";
import { tokens } from "./theme";

function Filters({ filters, subcategories, onFilterChange, onApplyFilters, onResetFilters }) {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
  const handleSubCategoryChange = (subCategoryId) => {
    onFilterChange({ sub_category: subCategoryId });
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
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      <Typography variant="h6" fontSize="16px">
        Filters
      </Typography>
      <Divider />

      {/* Subcategories Filter */}
      <Box>
        <Typography gutterBottom fontSize="14px">
          Sub Categories
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            maxHeight: "350px", // Increased height for more content
            overflowY: "auto",
            px: 1, // Padding for better spacing
          }}
        >
          {/* None Option */}
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                sx = {{color: colors.blueAccent[400]}}
                checked={!filters.sub_category} // None selected when sub_category is null or undefined
                onChange={() => handleSubCategoryChange(null)} // Clear sub_category filter
              />
            }
            label="ALL"
            sx={{
              fontSize: "12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          />

          {/* Subcategory Options */}
          {subcategories.map((sub) => (
            <FormControlLabel
              key={sub.category_id}
              control={
                <Checkbox
                  sx = {{color: colors.blueAccent[400]}}
                  size="small"
                  checked={filters.sub_category === sub.category_id}
                  onChange={() => handleSubCategoryChange(sub.category_id)}
                />
              }
              label={
                <Box display="flex" justifyContent="space-between" width="100%">
                  <Typography variant="body2" fontSize="12px" color="textPrimary">
                    {sub.category_name}
                  </Typography>
                </Box>
              }
              sx={{
                fontSize: "12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                color: colors.blueAccent[400]            }}
            />
          ))}
        </Box>
      </Box>

      <Divider />

      {/* Price Filter (Slider) */}
      <Box sx={{ px: 2 }}>
        <Typography gutterBottom fontSize="14px">
          Price Range
        </Typography>
        <Slider
          sx = {{color: colors.blueAccent[200]}}
          value={[filters.price_min || 0, filters.price_max || 1000]}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={1000}
          step={3}
        />
      </Box>

      {/* Rating Filter (Stars) */}
      <Box sx={{ px: 2 }}>
        <Typography gutterBottom fontSize="14px">
          Minimum Rating
        </Typography>
        <Rating
          name="rating-filter"
          value={filters.rating_min || 0}
          onChange={handleRatingChange}
          precision={1}
          size="small"
        />
      </Box>

      {/* Warranty Filter */}
      <TextField
        label="Min Warranty"
        type="number"
        value={filters.warranty_status || ""}
        onChange={handleWarrantyChange}
        fullWidth
        size="small"
      />

      <Divider />

      {/* Buttons */}
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
        <Button variant="contained" onClick={onApplyFilters} size="small" sx={{ fontSize: "12px", backgroundColor: colors.blueAccent[700] }}>
          Apply Filters
        </Button>
        <Button variant="outlined" onClick={onResetFilters} size="small" sx={{ fontSize: "12px", backgroundColor: colors.greenAccent[400] }}>
          Reset Filters
        </Button>
      </Box>
    </Box>
  );
}

export default Filters;
