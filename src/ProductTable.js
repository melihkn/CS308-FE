// src/components/ProductTable.js

import React, { useEffect, useState } from 'react';
import { fetchProducts, deleteProduct } from './api';
import ProductForm from './ProductForm';
import './Table.css';

const ProductTable = () => {
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = () => {
        console.log("Loading Products"); // Log for checking if products are loaded
        fetchProducts().then((response) => setProducts(response.data));
    };

    const handleDelete = async (id) => {
        try {
            console.log(`Deleting Product with ID ${id}`);
            await deleteProduct(id); // Call delete API
            setProducts(products.filter((product) => product.product_id !== id)); // Remove from state
            console.log(`Product with ID ${id} deleted successfully.`);
        } catch (error) {
            console.error("Failed to delete product:", error); // Handle error if delete fails
        }
    };

    const handleEdit = (product) => {
        console.log("Editing Product:", product);
        setEditingProduct(product); // Set product to be edited
        setIsModalOpen(true);       // Open the modal
    };

    const handleAdd = () => {
        console.log("Add Button Clicked"); // Log for checking if add button is clicked
        setEditingProduct(null);           // Clear editingProduct for a blank form
        setIsModalOpen(true);              // Open the modal
    };

    const handleCloseForm = () => {
        setEditingProduct(null);           // Clear the product on close
        setIsModalOpen(false);             // Close the modal
        loadProducts();                    // Reload the products
    };

    return (
        <div className="product-table-container">
            <div className="header">
                <h2>Products List</h2>
                <button className="add-button" onClick={setEditingProduct}>+ ADD</button>
            </div>
            <table className="product-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Model</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Cost</th>
                        <th>Quantity</th>
                        <th>Item Sold</th>
                        <th>Category ID</th>
                        <th>Distributor</th>
                        <th>Warranty Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.product_id}>
                            <td>{product.name}</td>
                            <td>{product.model}</td>
                            <td>{product.description}</td>
                            <td>{product.price}</td>
                            <td>{product.cost}</td>
                            <td>{product.quantity}</td>
                            <td>{product.item_sold}</td>
                            <td>{product.category_id}</td>
                            <td>{product.distributor}</td>
                            <td>{product.warranty_status} months</td>
                            <td>
                                <button onClick={() => handleEdit(product)}>✎</button>
                                <button onClick={() => handleDelete(product.product_id)}>🗑</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {editingProduct && (
                <ProductForm
                    product={editingProduct}
                    onClose={handleCloseForm}
                />
            )}
        </div>
    );
};

export default ProductTable;
