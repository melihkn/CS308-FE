// src/components/CategoryForm.js

import React, { useState, useEffect } from 'react';
import { createCategory, updateCategory } from './api'; // API calls for categories

const CategoryForm = ({ category = {}, onClose }) => {
    const [categoryName, setCategoryName] = useState('');
    const [parentCategoryId, setParentCategoryId] = useState(null);

    useEffect(() => {
        setCategoryName(category.category_name || '');
        setParentCategoryId(category.parentcategory_id || null);
    }, [category]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const categoryData = {
            category_name: categoryName,
            ...(parentCategoryId ? { parentcategory_id: parentCategoryId } : {}),
        };

        try {
            if (category.category_id) {
                await updateCategory(category.category_id, categoryData);
            } else {
                await createCategory(categoryData);
            }
            onClose();
        } catch (error) {
            console.error("Error saving category:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Category Name:</label>
                <input type="text" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} required />
            </div>
            <div>
                <label>Parent Category ID:</label>
                <input type="number" value={parentCategoryId || ''} onChange={(e) => setParentCategoryId(e.target.value)} />
            </div>
            <button type="submit">{category.category_id ? 'Update' : 'Create'} Category</button>
        </form>
    );
};

export default CategoryForm;
