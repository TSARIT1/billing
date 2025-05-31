import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './addproduct.css';
import axios from 'axios';

const AddProduct = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    productCode: '',
    productName: '',
    categoryId: '',
    unitId: '',
    purchasePrice: '',
    sellingPrice: '',
    stockQuantity: '',
    minStockLevel: '',
    barcode: '',
    taxRate: '',
    discount: '',
    expiryDate: '',
    manufacturer: '',
    supplier: '',
    description: '',
    isActive: true
  });

  // Fetch initial data
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchUnits();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchUnits = async () => {
    try {
      const response = await axios.get('/api/units');
      setUnits(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching units:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.productName.trim()) newErrors.productName = 'Product name is required';
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    if (!formData.unitId) newErrors.unitId = 'Unit is required';
    if (formData.sellingPrice <= 0) newErrors.sellingPrice = 'Selling price must be positive';
    if (formData.purchasePrice <= 0) newErrors.purchasePrice = 'Purchase price must be positive';
    if (formData.stockQuantity < 0) newErrors.stockQuantity = 'Stock cannot be negative';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      if (isEditing) {
        await axios.put(`/api/products/${currentProductId}`, formData);
      } else {
        await axios.post('/api/products', formData);
      }
      
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Please try again.');
    }
  };

  const handleEdit = (product) => {
    setFormData({
      productCode: product.productCode,
      productName: product.productName,
      categoryId: product.categoryId,
      unitId: product.unitId,
      purchasePrice: product.purchasePrice,
      sellingPrice: product.sellingPrice,
      stockQuantity: product.stockQuantity,
      minStockLevel: product.minStockLevel,
      barcode: product.barcode,
      taxRate: product.taxRate,
      discount: product.discount,
      expiryDate: product.expiryDate,
      manufacturer: product.manufacturer,
      supplier: product.supplier,
      description: product.description,
      isActive: product.isActive
    });
    setIsEditing(true);
    setCurrentProductId(product.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      productCode: '',
      productName: '',
      categoryId: '',
      unitId: '',
      purchasePrice: '',
      sellingPrice: '',
      stockQuantity: '',
      minStockLevel: '',
      barcode: '',
      taxRate: '',
      discount: '',
      expiryDate: '',
      manufacturer: '',
      supplier: '',
      description: '',
      isActive: true
    });
    setIsEditing(false);
    setCurrentProductId(null);
    setErrors({});
  };

  const handleExit = () => {
    navigate(-1);
  };

  return (
    <div className="ap-container">
      <button className="ap-close-button" onClick={handleExit}>X</button>

      <h2 className="ap-title">{isEditing ? 'Edit Product' : 'Add Product'}</h2>
      
      <form onSubmit={handleSubmit} className="ap-form">
        <div className="ap-form-group">
          <label className="ap-label">Product Code</label>
          <input 
            className="ap-input" 
            name="productCode" 
            value={formData.productCode} 
            onChange={handleChange} 
          />
        </div>

        <div className="ap-form-group">
          <label className="ap-label">Product Name *</label>
          <input 
            className={`ap-input ${errors.productName ? 'ap-input-error' : ''}`} 
            name="productName" 
            value={formData.productName} 
            onChange={handleChange} 
          />
          {errors.productName && <span className="ap-error">{errors.productName}</span>}
        </div>

        <div className="ap-form-row">
          <div className="ap-form-group ap-col">
            <label className="ap-label">Category *</label>
            <select 
              className={`ap-select ${errors.categoryId ? 'ap-input-error' : ''}`} 
              name="categoryId" 
              value={formData.categoryId} 
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            {errors.categoryId && <span className="ap-error">{errors.categoryId}</span>}
          </div>

          <div className="ap-form-group ap-col">
            <label className="ap-label">Unit *</label>
            <select 
              className={`ap-select ${errors.unitId ? 'ap-input-error' : ''}`} 
              name="unitId" 
              value={formData.unitId} 
              onChange={handleChange}
            >
              <option value="">Select Unit</option>
              {units.map(unit => (
                <option key={unit.id} value={unit.id}>{unit.name}</option>
              ))}
            </select>
            {errors.unitId && <span className="ap-error">{errors.unitId}</span>}
          </div>
        </div>

        <div className="ap-form-row">
          <div className="ap-form-group ap-col">
            <label className="ap-label">Purchase Price *</label>
            <input 
              className={`ap-input ${errors.purchasePrice ? 'ap-input-error' : ''}`} 
              type="number" 
              name="purchasePrice" 
              value={formData.purchasePrice} 
              onChange={handleChange} 
              min="0"
              step="0.01"
            />
            {errors.purchasePrice && <span className="ap-error">{errors.purchasePrice}</span>}
          </div>

          <div className="ap-form-group ap-col">
            <label className="ap-label">Selling Price *</label>
            <input 
              className={`ap-input ${errors.sellingPrice ? 'ap-input-error' : ''}`} 
              type="number" 
              name="sellingPrice" 
              value={formData.sellingPrice} 
              onChange={handleChange} 
              min="0"
              step="0.01"
            />
            {errors.sellingPrice && <span className="ap-error">{errors.sellingPrice}</span>}
          </div>
        </div>

        <div className="ap-form-row">
          <div className="ap-form-group ap-col">
            <label className="ap-label">Stock Quantity *</label>
            <input 
              className={`ap-input ${errors.stockQuantity ? 'ap-input-error' : ''}`} 
              type="number" 
              name="stockQuantity" 
              value={formData.stockQuantity} 
              onChange={handleChange} 
              min="0"
            />
            {errors.stockQuantity && <span className="ap-error">{errors.stockQuantity}</span>}
          </div>

          <div className="ap-form-group ap-col">
            <label className="ap-label">Min Stock Level</label>
            <input 
              className="ap-input" 
              type="number" 
              name="minStockLevel" 
              value={formData.minStockLevel} 
              onChange={handleChange} 
              min="0"
            />
          </div>
        </div>

        <div className="ap-form-row">
          <div className="ap-form-group ap-col">
            <label className="ap-label">Barcode</label>
            <input 
              className="ap-input" 
              name="barcode" 
              value={formData.barcode} 
              onChange={handleChange} 
            />
          </div>

          <div className="ap-form-group ap-col">
            <label className="ap-label">Tax Rate (%)</label>
            <input 
              className="ap-input" 
              type="number" 
              name="taxRate" 
              value={formData.taxRate} 
              onChange={handleChange} 
              min="0"
              max="100"
              step="0.01"
            />
          </div>
        </div>

        <div className="ap-form-row">
          <div className="ap-form-group ap-col">
            <label className="ap-label">Discount (%)</label>
            <input 
              className="ap-input" 
              type="number" 
              name="discount" 
              value={formData.discount} 
              onChange={handleChange} 
              min="0"
              max="100"
              step="0.01"
            />
          </div>

          <div className="ap-form-group ap-col">
            <label className="ap-label">Expiry Date</label>
            <input 
              className="ap-input" 
              type="date" 
              name="expiryDate" 
              value={formData.expiryDate} 
              onChange={handleChange} 
            />
          </div>
        </div>

        <div className="ap-form-group">
          <label className="ap-label">Manufacturer</label>
          <input 
            className="ap-input" 
            name="manufacturer" 
            value={formData.manufacturer} 
            onChange={handleChange} 
          />
        </div>

        <div className="ap-form-group">
          <label className="ap-label">Supplier</label>
          <input 
            className="ap-input" 
            name="supplier" 
            value={formData.supplier} 
            onChange={handleChange} 
          />
        </div>

        <div className="ap-form-group">
          <label className="ap-label">Description</label>
          <textarea 
            className="ap-textarea" 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            rows="3"
          />
        </div>

        <div className="ap-form-group ap-checkbox-group">
          <input 
            className="ap-checkbox" 
            type="checkbox" 
            name="isActive" 
            checked={formData.isActive} 
            onChange={handleChange} 
            id="isActive"
          />
          <label className="ap-checkbox-label" htmlFor="isActive">Active Product</label>
        </div>

        <div className="ap-form-buttons">
          <button type="submit" className="ap-button ap-button-primary">
            {isEditing ? 'Update Product' : 'Save Product'}
          </button>
          <button type="button" className="ap-button ap-button-secondary" onClick={resetForm}>
            Clear
          </button>
          {isEditing && (
            <button type="button" className="ap-button ap-button-danger" onClick={() => handleDelete(currentProductId)}>
              Delete
            </button>
          )}
        </div>
      </form>

      <div className="ap-product-list">
        <h3 className="ap-list-title">Product List</h3>
        <div className="ap-table-container">
          <table className="ap-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className={product.stockQuantity <= (product.minStockLevel || 0) ? 'ap-low-stock' : ''}>
                  <td>{product.productCode}</td>
                  <td>{product.productName}</td>
                  <td>{categories.find(c => c.id === product.categoryId)?.name || 'N/A'}</td>
                  <td>{product.sellingPrice}</td>
                  <td>{product.stockQuantity}</td>
                  <td>
                    <span className={`ap-status ${product.isActive ? 'ap-active' : 'ap-inactive'}`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="ap-action-button ap-edit-button" 
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;