import React, { useState, useEffect } from "react";
import axios from "axios";
import { Drawer, List, ListItem, ListItemText, Typography } from "@mui/material";

const CategorySidebar = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Backend'den kategorileri çek
        const response = await axios.get("http://127.0.0.1:8000/products/categories");
        setCategories(response.data); // Gelen kategori listesini state'e ata
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
        },
      }}
    >
      <div style={{ padding: "16px" }}>
        <Typography variant="h6">Kategoriler</Typography>
      </div>
      <List>
        {categories.map((category) => (
          <ListItem
            button
            key={category.category_id}
            onClick={() => onSelectCategory(category.category_name)}
          >
            <ListItemText primary={category.category_name} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default CategorySidebar;