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
import { useTheme } from "@mui/material";
import { tokens } from "./theme";

function FiltersSearch({ filters, onFilterChange, onApplyFilters, onResetFilters }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

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

      {/* Price Filter (Slider) */}
      <Box sx={{ px: 2 }}>
        <Typography gutterBottom fontSize="14px">
          Price Range
        </Typography>
        <Slider
          sx={{ color: colors.blueAccent[200] }}
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
      <Box sx={{ px: 2 }}>
        <Typography gutterBottom fontSize="14px">
          Warranty (in years)
        </Typography>
        <TextField
          label="Min Warranty"
          type="number"
          value={filters.warranty_status || ""}
          onChange={handleWarrantyChange}
          fullWidth
          size="small"
        />
      </Box>

      <Divider />

      {/* Buttons */}
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
        <Button
          variant="contained"
          onClick={onApplyFilters}
          size="small"
          sx={{ fontSize: "12px", backgroundColor: colors.blueAccent[700] }}
        >
          Apply Filters
        </Button>
        <Button
          variant="outlined"
          onClick={onResetFilters}
          size="small"
          sx={{
            fontSize: "12px",
            backgroundColor: colors.greenAccent[400],
            color: colors.grey[900],
            "&:hover": { backgroundColor: colors.greenAccent[300] },
          }}
        >
          Reset Filters
        </Button>
      </Box>
    </Box>
  );
}

export default FiltersSearch;