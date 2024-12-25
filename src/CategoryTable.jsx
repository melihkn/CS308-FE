import React, { useEffect, useState } from 'react';
import { fetchCategories, deleteCategory, updateCategory, createCategory } from './api'; // API calls for categories
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

const CategoryTable = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formValues, setFormValues] = useState({ category_name: '', parentcategory_id: '' });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetchCategories();
      const formattedCategories = response.map((category) => ({
        id: category.category_id, // Map category_id to id for DataGrid
        category_name: category.category_name,
        parentcategory_id: category.parentcategory_id,
      }));
      setCategories(formattedCategories);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      setCategories(categories.filter((category) => category.id !== id));
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormValues({
      category_name: category.category_name,
      parentcategory_id: category.parentcategory_id || '',
    });
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setFormValues({ category_name: '', parentcategory_id: '' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormValues({ category_name: '', parentcategory_id: '' });
  };

  const handleSave = async () => {
    try {
      const payload = {
        category_name: formValues.category_name,
        parentcategory_id: formValues.parentcategory_id || null,
      };
      console.log('Payload:', payload);
      if (editingCategory) {
        await updateCategory(editingCategory.id, payload); // Update existing category
      } else {
        await createCategory(payload); // Add new category
      }
      loadCategories();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const columns = [
    { field: 'category_name', headerName: 'Category Name', flex: 1 },
    { field: 'parentcategory_id', headerName: 'Parent Category ID', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box>
          <IconButton color="primary" onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%', height: 500 }}>
      <Button variant="contained" color="primary" onClick={handleAdd} sx={{ mb: 2 }}>
        + Add Category
      </Button>
      <DataGrid
        rows={categories}
        columns={columns}
        loading={loading}
        pageSize={10}
        rowsPerPageOptions={[10, 20, 50]}
        disableSelectionOnClick
      />

      {/* Modal for Add/Edit Category */}
      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Category Name"
            name="category_name"
            value={formValues.category_name}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
            required
          />
          <TextField
            label="Parent Category ID"
            name="parentcategory_id"
            value={formValues.parentcategory_id}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
            type="number"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoryTable;
