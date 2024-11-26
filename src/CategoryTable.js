// src/components/CategoryTable.js

import React, { useEffect, useState } from 'react';
import { fetchCategories, deleteCategory } from './api'; // API calls for categories
import CategoryForm from './CategoryForm';
import './Table.css';

const CategoryTable = () => {
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = () => {
        fetchCategories().then((response) => setCategories(response.data));
    };

    const handleDelete = async (id) => {
        try {
            console.log(`Deleting Category with ID ${id}`);
            await deleteCategory(id);
            setCategories(categories.filter((category) => category.category_id !== id));
            console.log(`Category with ID ${id} deleted successfully.`);
        } catch (error) {
            console.error("Failed to delete category:", error);
        }
    };

    const handleEdit = (category) => {
        console.log("Editing Category:", category);
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        console.log("Add Category Button Clicked");
        setEditingCategory(null);
        setIsModalOpen(true);
    };

    const handleCloseForm = () => {
        setEditingCategory(null);
        setIsModalOpen(false);
        loadCategories();
    };

    return (
        <div className="category-table-container">
            <div className="header">
                <h2>Categories List</h2>
                <button className="add-button" onClick={handleAdd}>+ ADD</button>
            </div>
            <table className="category-table">
                <thead>
                    <tr>
                        <th>Category Name</th>
                        <th>Parent Category ID</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category) => (
                        <tr key={category.category_id}>
                            <td>{category.category_name}</td>
                            <td>{category.parentcategory_id}</td>
                            <td>
                                <button onClick={() => handleEdit(category)}>✎</button>
                                <button onClick={() => handleDelete(category.category_id)}>🗑</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && (
                <CategoryForm
                    category={editingCategory}
                    onClose={handleCloseForm}
                />
            )}
        </div>
    );
};

export default CategoryTable;
