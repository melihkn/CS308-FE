// src/components/ProductTable.js

import React, { useEffect, useState } from 'react';
import { fetchProducts, deleteProduct, createProduct, updateProduct } from './api';
import {
    Box,
    Modal,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Typography,
    TextField,
    Paper,
    useTheme
} from '@mui/material';

import Header from './Header';

import { DataGrid } from "@mui/x-data-grid";

import {tokens} from './theme';

const ProductTable = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [products, setProducts] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formValues, setFormValues] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            console.log("Loading Products"); // Log for checking if products are loaded
            const response = await fetchProducts();
            console.log("Products Loaded:", response); // Log for checking if products are loaded
            const formattedProducts = response.map((product) => ({
                id: product.product_id, // DataGrid için benzersiz id
                name: product.name,
                model: product.model,
                description: product.description,
                quantity: product.quantity,
                itemsold: product.itemsold,
                price: parseFloat(product.price).toFixed(2),
                warranty_status: `${product.warranty_status} months`,
                distributor: product.distributor,
            }));
            setProducts(formattedProducts);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching products:", error); // Handle error if fetch fails
        }
        
    };

    const handleDelete = async (id) => {
        try {
            console.log(`Deleting Product with ID ${id}`);
            await deleteProduct(id); // Call delete API
            setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id)); 
            console.log(`Product with ID ${id} deleted successfully.`);
        } catch (error) {
            console.error("Failed to delete product:", error); // Handle error if delete fails
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormValues(product);
        setModalOpen(true);      // Open the modal
    };

    const handleAdd = () => {
        console.log("Add Button Clicked"); // Log for checking if add button is clicked
        setEditingProduct(null);
        setFormValues({
        name: "",
        model: "",
        description: "",
        quantity: "",
        itemsold: "",
        price: "",
        warranty_status: "",
        distributor: "",
        });
        setModalOpen(true);             // Open the modal
    };

    // Modal işlemleri
    const handleOpenModal = (product) => {
        setSelectedProduct(product);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setFormValues({});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
      };
    
      const handleSave = async () => {
        try {
          if (editingProduct) {
            // Update product
            await updateProduct(formValues);
            setProducts((prevProducts) =>
              prevProducts.map((product) =>
                product.id === formValues.id ? formValues : product
              )
            );
          } else {
            // Add new product
            const newProduct = await createProduct(formValues);
            setProducts((prevProducts) => [...prevProducts, newProduct]);
          }
          handleCloseModal();
        } catch (error) {
          console.error("Failed to save product:", error);
        }
      };


    const columns = [
        { field: "id", headerName: "Product ID", flex: 1 },
        { field: "name", headerName: "Name", flex: 1 },
        { field: "model", headerName: "Model", flex: 1 },
        { field: "description", headerName: "Description", flex: 2 },
        { field: "quantity", headerName: "Quantity", type: "number", flex: 1 },
        { field: "itemsold", headerName: "Items Sold", type: "number", flex: 1 },
        { field: "price", headerName: "Price", type: "number", flex: 1 },
        { field: "warranty_status", headerName: "Warranty Status", flex: 1 },
        { field: "distributor", headerName: "Distributor", flex: 1 },
        {
            field: "approve",
            headerName: "Approve",
            flex: 1,
            renderCell: (params) => (
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleEdit(params.row.id)}
              >
                Edit
              </Button>
            ),
          },
          {
            field: "dispprove",
            headerName: "Disapprove",
            flex: 1,
            renderCell: (params) => (
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleDelete(params.row.id)}
              >
                Delete
              </Button>
            ),
          },
    ]

    return (
        <Box m="20px">
          <Header title="Products" subtitle="List of Products" />
          <Button
            variant="contained"
            color="secondary"
            onClick={handleOpenModal}
            sx={{ mb: 2 }}
        >
            Create Product
        </Button>
          <Box
            m="40px 0 0 0"
            height="75vh"
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: colors.blueAccent[700],
                borderBottom: "none",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: colors.primary[400],
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "none",
                backgroundColor: colors.blueAccent[700],
              },
            }}
          >
            {loading ? (
              <Typography color="white">Loading...</Typography>
            ) : (
              <DataGrid rows={products} columns={columns} />
            )}
          </Box>

          {/* Set Price Modal */}
          <Modal open={isModalOpen} onClose={handleCloseModal}>
          <Box
            p={4}
            sx={{
            backgroundColor: colors.primary[1000],
            color: colors.grey[100],
            width: "90%", // Adjust width for smaller screens
            maxWidth: 500, // Limit the max width
            maxHeight: "80vh", // Limit the height to prevent overflow
            overflowY: "auto", // Make content scrollable if it overflows
            margin: "auto", // Center the modal
            position: "absolute", // Required for centering
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)", // Center horizontally and vertically
            borderRadius: "8px",
            boxShadow: 24, // Adds a shadow effect for better visibility
            }}
            >
            <Typography variant="h6" mb={2}>
                {editingProduct ? "Edit Product" : "Add Product"}
            </Typography>
            {[
                { label: "Name", name: "name" },
                { label: "Model", name: "model" },
                { label: "Description", name: "description" },
                { label: "Quantity", name: "quantity", type: "number" },
                { label: "Items Sold", name: "itemsold", type: "number" },
                { label: "Price", name: "price", type: "number" },
                { label: "Warranty Status (Months)", name: "warranty_status" },
                { label: "Distributor", name: "distributor" },
            ].map((field) => (
                <TextField
                key={field.name}
                fullWidth
                margin="normal"
                label={field.label}
                name={field.name}
                type={field.type || "text"}
                value={formValues[field.name] || ""}
                onChange={handleInputChange}
                />
            ))}
            <Button
                variant="contained"
                color="secondary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleSave}
            >
                Submit
            </Button>
            </Box>
        </Modal>
    
          
        </Box>
      );
};

export default ProductTable;
