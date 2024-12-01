// src/components/ProductForm.js

import React, { useState, useEffect } from 'react';
import { createProduct, updateProduct, fetchCategories } from './api';

const ProductForm = ({ product = {}, onClose }) => {
    const [name, setName] = useState('');
    const [model, setModel] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [cost, setCost] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [itemSold, setItemSold] = useState(0);
    const [serialNumber, setSerialNumber] = useState(''); // Corrected
    const [warrantyStatus, setWarrantyStatus] = useState('');
    const [distributor, setDistributor] = useState('');
    const [categoryId, setCategoryId] = useState(0);
    const [imageUrl, setImageUrl] = useState(''); // Added imageUrl state

    useEffect(() => {
        setName(product.name || '');
        setModel(product.model || '');
        setDescription(product.description || '');
        setPrice(product.price || '');
        setCost(product.cost || '');
        setQuantity(product.quantity || 0);
        setItemSold(product.item_sold || 0);
        setSerialNumber(product.serial_number || ''); // Corrected
        setWarrantyStatus(product.warranty_status || '');
        setDistributor(product.distributor || '');
        setCategoryId(product.category_id || 0);
        setImageUrl(product.image_url || ''); // Set initial value for imageUrl if exists
    }, [product]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form Submitted"); // Check if form submission is triggered

        const productData = {
            name,
            model,
            serial_number: serialNumber, // Corrected
            quantity: parseInt(quantity, 10),

            ...(description && { description }),
            ...(categoryId ? { category_id: parseInt(categoryId, 10) } : {}),
            ...(itemSold ? { item_sold: parseInt(itemSold, 10) } : {}),
            ...(price ? { price: parseFloat(price) } : {}),
            ...(cost ? { cost: parseFloat(cost) } : {}),
            ...(warrantyStatus ? { warranty_status: parseInt(warrantyStatus, 10) } : {}),
            ...(distributor && { distributor }),
            ...(imageUrl && { image_url: imageUrl }), // Corrected
        };
        try {
            if (product.product_id) {
                console.log("Updating Product:", productData); // Check data for updating
                await updateProduct(product.product_id, productData);
            } else {
                console.log("Creating New Product:", productData); // Check data for creating
                await createProduct(productData);
            }
            console.log("Product saved successfully");
            onClose(); // Close the modal after save
        } catch (error) {
            console.error("Error saving product:", error); // Log any errors
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ padding: '20px', minWidth: '300px' }}>
            <div>
                <label>Name:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
                <label>Model:</label>
                <input type="text" value={model} onChange={(e) => setModel(e.target.value)} required />
            </div>
            <div>
                <label>Description:</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div>
                <label>Price:</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
            <div>
                <label>Cost:</label>
                <input type="number" value={cost} onChange={(e) => setCost(e.target.value)} required />
            </div>
            <div>
                <label>Quantity:</label>
                <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
            </div>
            <div>
                <label>Items Sold:</label>
                <input type="number" value={itemSold} onChange={(e) => setItemSold(e.target.value)} />
            </div>
            <div>
                <label>Serial Number:</label>
                <input type="text" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} required />
            </div>
            <div>
                <label>Warranty (months):</label>
                <input type="number" value={warrantyStatus} onChange={(e) => setWarrantyStatus(e.target.value)} />
            </div>
            <div>
                <label>Distributor:</label>
                <input type="text" value={distributor} onChange={(e) => setDistributor(e.target.value)} />
            </div>
            <div>
                <label>Category ID:</label>
                <input
                    type="number"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" onClick={onClose} style={{ marginRight: '10px' }}>
                    Cancel
                </button>
                <button type="submit">{product.product_id ? 'Update' : 'Create'}Submit</button>
            </div>
        </form>
    );
};

export default ProductForm;
