// ProductCard.js
import React from "react";
import { Button, Card, CardContent, CardMedia, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";


/*
    ProductCard component is a reusable component that displays information about a product.
    It takes the following props:
        - name: name of the product
        - model: model of the product
        - description: description of the product
        - quantity: quantity of the product
        - distributor: distributor of the product
        - imageUrl: URL of the product image

    Example usage:
    <ProductCard 
        name="Dog Food"
        model="1234"
        description="A healthy dog food for your furry friend."
        quantity={10}
        distributor="PetCo"
        imageUrl="https://example.com/dog-food.jpg"
    />

    These info will be coming from the endpoint in the backend called /products which returns a list of products as json format.
    Each product in the list is a dictionary object with the following keys: 
        - product_id, name, model, description, quantity, distributor, image_url
        - image_url is the URL of the product image on the server 

*/


const ProductCard = ({ id, name, model, description, quantity, distributor, imageUrl }) => {
  const navigate = useNavigate();

  const handleDetailsClick = () => {
    navigate(`/product-detail/${id}`);
  };

  const handleAddToCard = () => {

  }

  return (
    <Card sx={{ maxWidth: 345, margin: 2 }}>
      <CardMedia
        component="img"
        alt={name}
        height="140"
        image={imageUrl}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Model:</strong> {model}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Quantity:</strong> {quantity}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Distributor:</strong> {distributor}
        </Typography>
        <Button variant="contained" color="primary" onClick={handleDetailsClick}>
          View Details
        </Button>
        <Button variant="contained" color="primary" onClick={handleAddToCard}>
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;