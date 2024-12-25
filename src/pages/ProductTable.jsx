import React, { useEffect, useState } from 'react';
import { fetchProducts, deleteProduct, createProduct, updateProduct } from '../api/api';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Close } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formValues, setFormValues] = useState({
    name: "",
    model: "",
    description: "",
    category_id: null,
    item_sold: 0,
    price: 0.0,
    cost: 0.0,
    serial_number: "",
    quantity: 0,
    warranty_status: null,
    distributor: "",
    image_url: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      console.log("Loading Products"); // Log for checking if products are loaded

      const response = await fetchProducts();
      console.log("Products Loaded:", response); // Log for checking if products are loaded

      const formattedProducts = response.map((product) => ({
        id: product.product_id, // Use product_id as unique id
        name: product.name,
        model: product.model,
        description: product.description,
        category_id: product.category_id,
        item_sold: product.item_sold,
        price: product.price,
        cost: product.cost,
        serial_number: product.serial_number,
        quantity: product.quantity,
        warranty_status: product.warranty_status, // Format warranty status
        distributor: product.distributor,
        image_url: product.image_url
      }));

      console.log("Formatted Products:", formattedProducts); // Debugging formatted products

      setProducts(formattedProducts);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error); // Handle error if fetch fails
    }
  };

  const handleDelete = async (id) => {
    try {
      console.log("Deleting product with ID:", id);
      await deleteProduct(id);
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const handleEdit = (id) => {
    const productToEdit = products.find((product) => product.id === id);
    console.log("Editing product:", productToEdit);
    setEditingProduct(productToEdit);
    setFormValues({
      id: productToEdit.id,
      name: productToEdit.name || "",
      model: productToEdit.model || "",
      description: productToEdit.description || "",
      category_id: productToEdit.category_id || null,
      item_sold: productToEdit.item_sold || 0,
      price: productToEdit.price || 0.0,
      cost: productToEdit.cost || 0.0,
      serial_number: productToEdit.serial_number || "",
      quantity: productToEdit.quantity || 0,
      warranty_status: productToEdit.warranty_status || null,
      distributor: productToEdit.distributor || "",
      image_url: productToEdit.image_url || "",
    });
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setFormValues({
      name: "",
      model: "",
      description: "",
      category_id: null,
      item_sold: 0,
      price: 0.0,
      cost: 0.0,
      serial_number: "",
      quantity: 0,
      warranty_status: null,
      distributor: "",
      image_url: "",
    });
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
        const { id, ...rest } = formValues;
        console.log("ID:", id);

        rest.quantity = parseInt(rest.quantity);
  
        console.log("Payload for update:", rest);
        await updateProduct(id, rest);
  
        // Update state
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === id ? { ...product, ...rest } : product
          )
        );
      } else {
        console.log("Creating new product:", formValues);
        formValues.quantity = parseInt(formValues.quantity);
        formValues.price = parseFloat(formValues.price);
        formValues.cost = parseFloat(formValues.cost);
        formValues.warranty_status = parseInt(formValues.warranty_status);
        formValues.category_id = parseInt(formValues.category_id);
        formValues.item_sold = parseInt(formValues.item_sold);
        const newProduct = await createProduct(formValues);
        console.log("New Product:", newProduct);
        setProducts((prevProducts) => [
          ...prevProducts,
          { ...newProduct.data, id: newProduct.data.product_id },
        ]);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving product:", error.response?.data || error.message);
    }
  };
  
  

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'model', headerName: 'Model', flex: 1 },
    {
      field: 'price',
      headerName: 'Price',
      flex: 1,
      renderCell: (params) => {
        // Add the dollar sign to the displayed value
        return `$${Number(params.value).toFixed(2)}`;
      },
    },
    { field: 'quantity', headerName: 'Quantity', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleEdit(params.row.id)} color="primary">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)} color="error">
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
      sortable: false,
      filterable: false,
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleAdd}
        sx={{ mb: 2 }}
      >
        Add New Product
      </Button>
      <Box sx={{ height: 500 }}>
        <DataGrid
          rows={products}
          columns={columns}
          loading={loading}
          disableSelectionOnClick
          pageSize={10}
        />
      </Box>

      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>
          {editingProduct ? "Edit Product" : "Add Product"}
          <IconButton
            onClick={handleCloseModal}
            color="error"
            sx={{ position: "absolute", top: 5, right: 5 }}
          >
            <CloseIcon />
          </IconButton>
          </DialogTitle>
        <DialogContent>
          {[
            { label: "Name", name: "name" },
            { label: "Model", name: "model" },
            { label: "Description", name: "description" },
            { label: "Category ID", name: "category_id", type: "number" },
            { label: "Items Sold", name: "item_sold", type: "number" },
            { label: "Price", name: "price", type: "number" },
            { label: "Cost", name: "cost", type: "number" },
            { label: "Serial Number", name: "serial_number" },
            { label: "Quantity", name: "quantity", type: "number" },
            { label: "Warranty Status (Months)", name: "warranty_status", type: "number" },
            { label: "Distributor", name: "distributor" },
            { label: "Image URL", name: "image_url" },
          ].map((field) => (
            <TextField
              key={field.name}
              margin="dense"
              label={field.label}
              type={field.type || "text"}
              fullWidth
              variant="outlined"
              name={field.name}
              value={formValues[field.name] || ""}
              onChange={handleInputChange}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductTable;
